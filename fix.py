c = open('mimi_llm_session.py', encoding='utf-8').read()
c = c.replace(
    'text: 1-2 short simple sentences in English only. Max 1-2 Hindi words allowed. No questions.',
    'text: 1-2 short simple sentences in English only. No Hindi words. No questions.'
)
open('mimi_llm_session.py', 'w', encoding='utf-8').write(c)
print('Done:', 'No Hindi words' in c)