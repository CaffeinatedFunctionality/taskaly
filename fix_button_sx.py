import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# 1. Fix escaped quotes in variant and color attributes (and any other escaped quotes)
# We replace backslash-doublequote with just doublequote
new_content = content.replace('\\\\\\"', '\\"')

# 2. Ensure subscription hook is present after useAuth hook
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

# 3. Remove the Button's sx prop (which is sx={{ mt: 2 }})
new_content = new_content.replace('sx={{ mt: 2 }}', '')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)

print('Fixed quotes, added subscription hook, removed Button sx')
