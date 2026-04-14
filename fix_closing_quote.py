import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace escaped closing quotes: \\\" -> "
new_content = content.replace('\\\"', '"')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed escaped closing quotes')
