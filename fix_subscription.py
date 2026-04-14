import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# We need to add the subscription hook after the useAuth hook
# Find the line: const { user } = useAuth();
# And add after it: const { subscription } = useSubscription();

new_content = content.replace('const { user } = useAuth();', 'const { user } = useAuth();\n  const { subscription } = useSubscription();')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Added subscription hook')
