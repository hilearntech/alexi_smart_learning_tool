from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from extensions import users, bcrypt

admin_bp = Blueprint("admin", __name__)

@admin_bp.route('/api/admin/pending')
def pending_users():
    data = list(users.find({"status": "pending"}))
    return dumps(data)


# ============================
# APPROVE USER
# ============================
@admin_bp.route('/api/admin/approve/<id>', methods=['PUT'])
def approve_user(id):
    users.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "approved"}}
    )
    return jsonify({"msg": "User approved"})


@admin_bp.route('/api/admin/all-users')
def all_users():
    all_users = list(users.find({"role": {"$in": ["parent", "teacher"]}}))

    formatted = []
    for u in all_users:
        formatted.append({
            "_id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email"),
            "phone": u.get("phone"),
            "school": u.get("school"),
            "class": u.get("class"),
            "status": u.get("status"),
            "role": u.get("role"),
            "created_at": u.get("created_at")
        })

    return jsonify(formatted)


@admin_bp.route('/api/admin/add-teacher', methods=['POST'])
def add_teacher():
    data = request.json

    if users.find_one({"email": data["email"]}):
        return jsonify({"msg": "Email exists"}), 400

    teacher = {
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "school": data.get("school"),
        "class": data.get("class"),
        "role": "teacher",
        "password": bcrypt.generate_password_hash(data["password"]).decode(),
        "status": "approved",
        "created_at": datetime.utcnow()
    }

    users.insert_one(teacher)
    return jsonify({"msg": "Teacher added"})

# ============================
# EDIT TEACHER
# ============================
@admin_bp.route('/api/admin/edit-teacher/<id>', methods=['PUT'])
def edit_teacher(id):
    data = request.json

    update_data = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "school": data.get("school"),
        "class": data.get("class"),
        "status": data.get("status"),
    }

    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}

    # If password is updated
    if data.get("password"):
        update_data["password"] = bcrypt.generate_password_hash(
            data["password"]
        ).decode()

    users.update_one(
        {"_id": ObjectId(id), "role": "teacher"},
        {"$set": update_data}
    )

    return jsonify({"msg": "Teacher updated successfully"})