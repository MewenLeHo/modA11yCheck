# Modal A11y Check

A comprehensive JavaScript tool for testing modal dialog accessibility compliance with WCAG and WAI-ARIA guidelines. Provides automated checks, interactive tests, and visual reporting.

## Latest Updates
- Added Chart.js integration for visual results
- Implemented interactive keyboard navigation tests
- Enhanced automated ARIA validation
- Added HTML report export functionality
- Improved test result visualization

## Features

- <span aria-hidden="true">🔍</span> **Automated Testing**: Validates ARIA roles, attributes and focus management
- <span aria-hidden="true">⌨️</span> **Interactive Tests**: Guides through keyboard navigation verification
- <span aria-hidden="true">📊</span> **Visual Reports**: Charts and timelines of test results
- <span aria-hidden="true">📑</span> **Export**: Generate detailed HTML accessibility reports

## Installation

1. Create a new bookmark in your browser
2. Copy the minified code from `modalA11yCheck.min.js`
3. Paste as the bookmark URL

## Usage

1. Navigate to any page with modal dialogs
2. Click the bookmarklet
3. Review test results:
   - <span aria-hidden="true">🟢</span> **Pass**: Meets accessibility requirements
   - <span aria-hidden="true">🔴</span> **Fail**: Issues detected
   - <span aria-hidden="true">🟡</span> **Warning**: Potential concerns
4. Complete interactive tests
5. Export detailed report

## Validation Features

The tool checks:
- ARIA roles and attributes
- Focus management
- Keyboard interaction
- Background interaction
- Modal labeling

### Automated Tests
- Dialog role validation
- ARIA modal attributes
- Focus trap implementation
- Accessible name verification
- Background interaction blocking

### Interactive Tests
- Keyboard navigation
- Focus management
- Escape key handling
- Focus restoration

## Technical Details

- **Chart.js Integration**: Visual data representation
- **Performance**: Optimized DOM operations
- **Accessibility**: WAI-ARIA compliant UI
- **Modular Design**: Maintainable code structure

## Why Use This?

- **Accessibility Compliance**: Ensure WCAG conformance
- **UX Testing**: Validate modal interactions
- **Quality Assurance**: Quick accessibility checks
- **Documentation**: Generate compliance reports
- **Zero Setup**: Works directly in browser

## Browser Support

Works in modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Limitations

This tool:
- Only tests modal dialog accessibility
- Requires manual verification for some tests
- Does not fix detected issues
- Focuses on WCAG 2.1 requirements

## Future Improvements
- Additional automated tests
- Enhanced reporting features
- Test configuration options
- Accessibility fixes suggestions

## Contribution

Feel free to contribute by submitting issues or pull requests to enhance the tool's functionality or improve documentation. Your feedback is welcome!

## How to contribute?

1. Fork the repository
2. Modify the main `modalA11yCheck.js` file
3. Submit a pull request

**Note**: The minified version will be automatically generated during the build process - you only need to work with the main JavaScript file.

## Contributors

- [Mewen Le Hô](https://github.com/MewenLeHo)
