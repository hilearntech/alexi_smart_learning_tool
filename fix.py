c = open('mimi_llm_session.py', encoding='utf-8').read()

old = "pages = r.json().get('query',{}).get('pages',{})\n            for page in pages.values():\n                url = page.get('imageinfo',[{}])[0].get('url')\n                if url:\n                    return url"

new = "pages = r.json().get('query',{}).get('pages',{})\n            for page in pages.values():\n                imageinfo = page.get('imageinfo', [])\n                if imageinfo:\n                    url = imageinfo[0].get('url')\n                    if url:\n                        print('WIKIMEDIA RESULT:', url)\n                        return url"

c = c.replace(old, new)
open('mimi_llm_session.py', 'w', encoding='utf-8').write(c)
print('Done:', 'WIKIMEDIA RESULT' in c)
