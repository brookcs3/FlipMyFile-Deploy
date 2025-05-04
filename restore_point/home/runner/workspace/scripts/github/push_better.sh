#!/bin/bash

set -e

# Set GitHub credentials from environment variables
export GH_USERNAME=$GITHUB_USERNAME
export GH_TOKEN=$GITHUB_TOKEN

# Define repository information
REPO_OWNER="brookcs3"
REPO_NAME="heicflip"
BRANCH="main"

# Setup temporary directory
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

# Clone repository
echo "Cloning repository..."
git clone "https://$GH_USERNAME:$GH_TOKEN@github.com/$REPO_OWNER/$REPO_NAME.git" "$TMP_DIR"

# Navigate to repository
cd "$TMP_DIR"

# Configure Git
git config user.name "$GH_USERNAME"
git config user.email "$GH_USERNAME@users.noreply.github.com"

# Create the directory structure if it doesn't exist
mkdir -p client/src

# Create the fixed index.css file directly
cat > client/src/index.css << 'CSSEOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 24 78% 52%; /* Amber color (HEIC): Pantone Amberglow #DD7230 */
    --primary-foreground: 210 20% 98%;
    --secondary: 16 66% 43%; /* Deeper amber for secondary: #B85A25 */
    --secondary-foreground: 210 20% 98%;
    --accent: 20 84% 69%; /* Lighter amber for accent: #F39C6B */
    --accent-foreground: 222.2 47.4% 11.2%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 24 78% 52%; /* Keep amber color in dark mode */
    --primary-foreground: 210 20% 98%;
    --secondary: 16 66% 43%; /* Keep deeper amber in dark mode */
    --secondary-foreground: 210 20% 98%;
    --accent: 20 84% 69%; /* Keep lighter amber in dark mode */
    --accent-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 216 12.2% 83.9%;
  }
}

@layer base {
  * {
    @apply border-[hsl(var(--border))];
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom animations */
@keyframes pulse-amber {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse-amber {
  animation: pulse-amber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom utility classes */
.amber-gradient {
  background: linear-gradient(135deg, #DD7230 0%, #F39C6B 100%);
}

.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}
CSSEOF

# Add changes
git add client/src/index.css

# Check if there are changes to commit
git diff --staged --quiet && {
  echo "No changes to commit"
  exit 0
}

# Commit changes
echo "Committing changes..."
git commit -m "Fix: Update border CSS to fix Tailwind build error

- Replace border-border with explicit HSL value
- Fix deployment build error on Vercel"

# Push changes
echo "Pushing changes..."
git push origin $BRANCH

echo "Successfully pushed CSS fix to GitHub!"
