#!/usr/bin/env python
'''
Run all tests for the HealthCare Sciences Dashboard
'''
import sys
import pytest
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def main():
    print('='*60)
    print('Running HealthCare Sciences Dashboard Tests')
    print('='*60)
    
    # Run pytest with verbose output
    exit_code = pytest.main([
        'tests/',
        '-v',
        '--tb=short',
        '--color=yes'
    ])
    
    sys.exit(exit_code)

if __name__ == '__main__':
    main()
