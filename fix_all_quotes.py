import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace escaped quotes in variant attributes
new_content = content.replace('variant=\\\"', 'variant=\"')
# Also fix any other escaped quotes that might be in the file (like in sx? but sx uses double quotes inside curly braces, which is fine)
# We'll also replace any other occurrences of \\\" that are not part of a larger pattern? But we'll do a global replace for safety.
# However, note that the string might have \\\" in other places like in the TextField label? We see label=\"Project Title\" etc. Those are fine.

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed escaped quotes in variant attributes')
