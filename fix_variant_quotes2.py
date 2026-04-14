import sys
with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Replace escaped quotes in variant attributes
# We see: variant=\\\"body2\\\" and variant=\\\"h4\\\" etc.
# We'll replace '\\\"' with '"' but note: we have to do it for each occurrence.
# However, note that the string we read has two backslashes and a quote? Actually, the file contains a backslash and a quote.
# When we read it, we see two backslashes (because the backslash is escaped) and a quote.
# So we replace '\\\\"' with '"'? Let's think: we want to remove the backslash before the quote.
# We'll do: replace '\\\"' with '"' but note that in the string we read, one backslash is represented as '\\\\'? 
# Let's try a different approach: replace the specific pattern for each variant.

# We'll do:
new_content = content.replace('variant=\\\"body2\\\"', 'variant=\"body2\"')
new_content = new_content.replace('variant=\\\"h4\\\"', 'variant=\"h4\"')

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(new_content)
print('Fixed variant quotes for body2 and h4')
