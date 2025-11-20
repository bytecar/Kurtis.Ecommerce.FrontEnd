#!/usr/bin/env python3
"""
Resolve git merge conflicts by accepting the incoming changes (code after =======).
This script removes HEAD code and keeps the incoming branch code.
"""
import re
import subprocess
import sys

def get_files_with_conflicts():
    """Get list of files containing conflict markers."""
    try:
        result = subprocess.run(
            ['git', 'grep', '-l', '<<<<<<< HEAD'],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip().split('\n') if result.stdout.strip() else []
    except subprocess.CalledProcessError:
        return []

def resolve_conflict_in_file(filepath):
    """Resolve conflicts in a single file by keeping incoming changes."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Use regex to find and resolve conflicts
        # Pattern matches: <<<<<<< HEAD ... ======= ... >>>>>>> hash
        pattern = r'<<<<<<< HEAD:?.*?\n(.*?)=======\n(.*?)>>>>>>> [a-f0-9]+:?.*?\n'
        
        # Replace with just the incoming changes (group 2)
        resolved = re.sub(pattern, r'\2', content, flags=re.DOTALL)
        
        # Also handle simpler conflicts without file paths
        pattern2 = r'<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> [a-f0-9]+\n'
        resolved = re.sub(pattern2, r'\2', resolved, flags=re.DOTALL)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(resolved)
        
        return True
    except Exception as e:
        print(f"Error resolving {filepath}: {e}", file=sys.stderr)
        return False

def main():
    files = get_files_with_conflicts()
    
    if not files:
        print("No files with conflict markers found.")
        return 0
    
    print(f"Found {len(files)} files with conflicts:")
    resolved_count = 0
    
    for filepath in files:
        print(f"  Resolving: {filepath}")
        if resolve_conflict_in_file(filepath):
            resolved_count += 1
            print(f"    [OK] Resolved")
        else:
            print(f"    [FAIL] Failed")
    
    print(f"\nResolved {resolved_count}/{len(files)} files.")
    return 0 if resolved_count == len(files) else 1

if __name__ == '__main__':
    sys.exit(main())
