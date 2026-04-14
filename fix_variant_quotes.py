import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace escaped quotes in variant attributes
new_content = content.replace('variant=\\\"body2\\\"', 'variant=\"body2\"')
new_content = new_content.replace('variant=\\\"h4\\\"', 'variant=\"h4\"')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed variant quotes')
