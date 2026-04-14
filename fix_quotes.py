import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace escaped quotes in variant attributes
# We see: variant=\\\"body2\\\" and also variant=\\\"h4\\\" etc.
# We'll replace '\\\"' with '"' but careful not to break other parts.
# Since the file is TypeScript/JSX, we can safely replace all occurrences of '\\\"' with '"'
new_content = content.replace('\\\\\"', '"')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed escaped quotes')
