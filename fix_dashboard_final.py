import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace the outer Box's gap with a fixed number (24) -> 24px
new_content = content.replace('<Box sx={{ display: "flex", flexDirection: "column", gap: (theme) => theme.spacing(3) }}>',
                              '<Box sx={{ display: "flex", flexDirection: "column", gap: 24 }}>')
# Remove the sx prop from the Button (which is sx={{ mt: 2 }})
# We'll replace the Button opening tag up to the sx, and then close the Button without sx.
# We'll do: replace 'sx={{ mt: 2 }}' with empty string.
new_content = new_content.replace('sx={{ mt: 2 }}', '')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed outer Box gap and removed Button mt')
