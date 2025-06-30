#!/bin/bash

# Cleanup script to remove all dist folders from the monorepo
echo "🧹 Starting cleanup process..."

# Find and remove all dist folders
echo "📁 Searching for dist folders..."
find . -type d -name "dist" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r dir; do
    echo "🗑️  Removing: $dir"
    rm -rf "$dir"
done

# Also remove common build artifacts
echo "🗑️  Removing other build artifacts..."
find . -type d -name "build" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r dir; do
    echo "🗑️  Removing: $dir"
    rm -rf "$dir"
done

find . -type d -name ".next" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r dir; do
    echo "🗑️  Removing: $dir"
    rm -rf "$dir"
done

find . -type d -name "coverage" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r dir; do
    echo "🗑️  Removing: $dir"
    rm -rf "$dir"
done

# Clean turbo cache
echo "🧹 Cleaning Turbo cache..."
rm -rf .turbo

echo "✅ Cleanup completed successfully!"
