import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace the Stack opening tag
new_content = content.replace('<Stack spacing={3}>', '<Box sx={{ display: "flex", flexDirection: "column", gap: (theme) => theme.spacing(3) }}>')
# Replace the Stack closing tag
new_content = new_content.replace('</Stack>', '</Box>')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Replaced Stack with Box')
