import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Step 1: Fix escaped quotes in variant attributes and any other escaped quotes in the file
# We replace backslash-doublequote with just doublequote
new_content = content.replace('\\\\\\"', '\\"')

# Step 2: Add subscription hook after useAuth hook if not already present
# We look for the line: const { user } = useAuth();
# and insert after it: const { subscription } = useSubscription();
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

# Step 3: Replace Stack with Box using theme spacing for gap
new_content = new_content.replace('<Stack spacing={3}>', '<Box sx={{ display: \"flex\", flexDirection: \"column\", gap: (theme) => theme.spacing(3) }}>')
new_content = new_content.replace('</Stack>', '</Box>')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)

print('Fixed quotes, added subscription hook, replaced Stack with Box (using theme spacing)')
