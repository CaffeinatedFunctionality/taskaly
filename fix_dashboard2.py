import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace the outer Box's gap with a fixed number (24px)
new_content = content.replace('<Box sx={{ display: "flex", flexDirection: "column", gap: (theme) => theme.spacing(3) }}>',
                              '<Box sx={{ display: "flex", flexDirection: "column", gap: 24 }}>')
# Replace the Button's sx to remove mt (we'll remove the sx prop entirely for now)
# We'll replace the Button opening tag up to the sx, and then close the Button without sx.
# But note: the Button has multiple props. We'll do a more targeted replacement.
# We'll replace: sx={{ mt: 2 }} with an empty string.
new_content = new_content.replace('sx={{ mt: 2 }}', '')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed outer Box gap and removed Button mt')
