import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Add subscription hook after useAuth hook if not already present
    if line.strip() == 'const { user } = useAuth();':
        new_lines.append(line)
        # Check if the next line already has subscription hook
        if i+1 < len(lines) and 'subscription' not in lines[i+1]:
            new_lines.append('  const { subscription } = useSubscription();\n')
        i += 1
        continue
    # Replace escaped quotes
    if '\\\\"' in line:
        line = line.replace('\\\\"', '"')
    new_lines.append(line)
    i += 1

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.writelines(new_lines)
print('Fixed escaped quotes and ensured subscription hook')
