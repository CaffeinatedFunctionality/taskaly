import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# 1. Fix escaped quotes in variant and color attributes (and any other escaped quotes)
# We replace backslash-doublequote with just doublequote
new_content = content.replace('\\\\\\"', '\\"')

# 2. Add subscription hook after useAuth hook if not already present
lines = new_content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    new_lines.append(line)
    if line.strip() == 'const { user } = useAuth();':
        # Check if the next line already has subscription hook
        if i+1 < len(lines) and 'subscription' not in lines[i+1]:
            new_lines.append('  const { subscription } = useSubscription();')
    i += 1
new_content = '\n'.join(new_lines)

# 3. Replace Stack with Box using a fixed gap (24px) for simplicity
# We'll replace the opening and closing tags
new_content = new_content.replace('<Stack spacing={3}>', '<Box sx={{ display: \"flex\", flexDirection: \"column\", gap: 24 }}>')
new_content = new_content.replace('</Stack>', '</Box>')

# 4. Fix the Button's sx prop: we'll keep it as is for now, but if it's causing issues, we can try to remove the sx and use style instead.
# However, let's first try to keep it and see if the build passes.

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)

print('Applied fixes: quotes, subscription hook, Stack->Box with gap=24')
