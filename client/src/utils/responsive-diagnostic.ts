/**
 * Mobile Responsiveness Diagnostic Tool
 * 
 * This utility provides functions to analyze and diagnose responsive design issues
 * across various device viewport sizes.
 */

export interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  devicePixelRatio: number;
  userAgent: string;
  type: 'mobile' | 'tablet' | 'desktop';
}

// Common device specifications for testing
export const deviceSpecs: DeviceSpec[] = [
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    type: 'mobile'
  },
  {
    name: 'iPhone 12/13',
    width: 390,
    height: 844,
    devicePixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    type: 'mobile'
  },
  {
    name: 'iPhone 12/13 Pro Max',
    width: 428,
    height: 926,
    devicePixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    type: 'mobile'
  },
  {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    devicePixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.210 Mobile Safari/537.36',
    type: 'mobile'
  },
  {
    name: 'iPad',
    width: 768,
    height: 1024,
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    type: 'tablet'
  },
  {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    devicePixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    type: 'tablet'
  },
  {
    name: 'Desktop (1080p)',
    width: 1920,
    height: 1080,
    devicePixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    type: 'desktop'
  }
];

export interface ElementCheck {
  element: HTMLElement;
  rules: ResponsiveRule[];
  status: 'pass' | 'fail' | 'warning';
  issues: string[];
}

export interface ResponsiveRule {
  name: string;
  description: string;
  check: (element: HTMLElement, viewport: {width: number, height: number}) => boolean;
  severity: 'error' | 'warning';
  fixSuggestion: string;
}

// Common responsive design rules
export const responsiveRules: ResponsiveRule[] = [
  {
    name: 'overflow-x',
    description: 'Element causes horizontal scrolling',
    check: (element, viewport) => {
      const rect = element.getBoundingClientRect();
      return rect.width <= viewport.width;
    },
    severity: 'error',
    fixSuggestion: 'Use max-width: 100%, overflow-x: hidden, or adjust padding/margin'
  },
  {
    name: 'tap-target-size',
    description: 'Interactive element is too small for touch',
    check: (element, _) => {
      if (!element.tagName) return true;
      const isInteractive = element.tagName === 'BUTTON' || 
                           element.tagName === 'A' || 
                           element.tagName === 'INPUT' ||
                           element.getAttribute('role') === 'button';
      
      if (!isInteractive) return true;
      
      const rect = element.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44;
    },
    severity: 'warning',
    fixSuggestion: 'Increase size to at least 44x44px for touch targets'
  },
  {
    name: 'font-size',
    description: 'Text is too small to read on mobile',
    check: (element, _) => {
      const computedStyle = window.getComputedStyle(element);
      const hasText = element.innerText && element.innerText.trim().length > 0;
      
      if (!hasText) return true;
      
      const fontSize = parseFloat(computedStyle.fontSize);
      return fontSize >= 12;
    },
    severity: 'warning',
    fixSuggestion: 'Increase font size to at least 12px on mobile devices'
  },
  {
    name: 'aspect-ratio',
    description: 'Image aspect ratio is distorted',
    check: (element, _) => {
      if (element.tagName !== 'IMG') return true;
      
      const img = element as HTMLImageElement;
      if (!img.complete) return true; // Skip incomplete images
      
      const rect = element.getBoundingClientRect();
      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const displayRatio = rect.width / rect.height;
      
      // Allow 5% tolerance
      return Math.abs(naturalRatio - displayRatio) / naturalRatio < 0.05;
    },
    severity: 'warning',
    fixSuggestion: 'Use object-fit: cover or contain to maintain aspect ratio'
  }
];

/**
 * Checks if an element is visible in the viewport
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Diagnoses responsive issues for a specific element
 */
export function diagnoseElement(
  element: HTMLElement, 
  viewport: {width: number, height: number},
  rules: ResponsiveRule[] = responsiveRules
): ElementCheck {
  const issues: string[] = [];
  let status: 'pass' | 'fail' | 'warning' = 'pass';

  for (const rule of rules) {
    const passes = rule.check(element, viewport);
    if (!passes) {
      issues.push(`${rule.description} (${rule.fixSuggestion})`);
      if (rule.severity === 'error') {
        status = 'fail';
      } else if (status !== 'fail') {
        status = 'warning';
      }
    }
  }

  return {
    element,
    rules,
    status,
    issues
  };
}

/**
 * Scans the entire page for responsive issues
 */
export function scanPage(
  viewport: {width: number, height: number}, 
  options: {
    selector?: string,
    maxElements?: number,
    rules?: ResponsiveRule[]
  } = {}
): ElementCheck[] {
  const {
    selector = '*', 
    maxElements = 100,
    rules = responsiveRules
  } = options;
  
  const elements = Array.from(document.querySelectorAll(selector)).slice(0, maxElements) as HTMLElement[];
  return elements.map(element => diagnoseElement(element, viewport, rules));
}

/**
 * Highlights elements with issues on the page for visual debugging
 */
export function highlightIssues(elementChecks: ElementCheck[]): void {
  // Remove any existing highlights
  const existingHighlights = document.querySelectorAll('.responsive-diagnostic-highlight');
  existingHighlights.forEach(el => el.remove());
  
  // Add new highlights
  elementChecks.filter(check => check.status !== 'pass').forEach(check => {
    const rect = check.element.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.className = 'responsive-diagnostic-highlight';
    highlight.style.position = 'absolute';
    highlight.style.border = check.status === 'fail' ? '2px solid red' : '2px solid orange';
    highlight.style.backgroundColor = check.status === 'fail' ? 'rgba(255,0,0,0.2)' : 'rgba(255,165,0,0.2)';
    highlight.style.zIndex = '10000';
    highlight.style.pointerEvents = 'none';
    highlight.style.top = `${rect.top + window.scrollY}px`;
    highlight.style.left = `${rect.left + window.scrollX}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    
    // Add tooltip with issues
    highlight.title = check.issues.join('\n');
    
    document.body.appendChild(highlight);
  });
}

/**
 * Clears all diagnostic highlights from the page
 */
export function clearHighlights(): void {
  const highlights = document.querySelectorAll('.responsive-diagnostic-highlight');
  highlights.forEach(el => el.remove());
}

/**
 * Simulates a specific device's viewport
 * For use in development/testing environments
 */
export function simulateDevice(device: DeviceSpec): void {
  // Create device simulation overlay
  const overlay = document.createElement('div');
  overlay.className = 'device-simulation-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
  overlay.style.zIndex = '10001';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  
  // Create simulated device frame
  const frame = document.createElement('div');
  frame.className = 'device-simulation-frame';
  frame.style.width = `${device.width}px`;
  frame.style.height = `${device.height}px`;
  frame.style.backgroundColor = '#fff';
  frame.style.border = '10px solid #333';
  frame.style.borderRadius = '20px';
  frame.style.overflow = 'hidden';
  frame.style.position = 'relative';
  
  // Create iframe with current site
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.src = window.location.href;
  
  // Create device info label
  const label = document.createElement('div');
  label.className = 'device-simulation-label';
  label.style.position = 'absolute';
  label.style.top = '-40px';
  label.style.left = '0';
  label.style.width = '100%';
  label.style.textAlign = 'center';
  label.style.color = '#fff';
  label.style.fontSize = '16px';
  label.innerHTML = `
    ${device.name} (${device.width}x${device.height}, ${device.devicePixelRatio}x)
    <button class="close-simulation" style="margin-left: 20px; padding: 5px 10px; background: #555; border: none; color: white; border-radius: 4px; cursor: pointer;">
      Close
    </button>
  `;
  
  // Append elements
  frame.appendChild(iframe);
  overlay.appendChild(frame);
  overlay.appendChild(label);
  document.body.appendChild(overlay);
  
  // Handle close button
  const closeButton = overlay.querySelector('.close-simulation');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      overlay.remove();
    });
  }
}

/**
 * Generates a report of responsive issues 
 */
export function generateReport(elementChecks: ElementCheck[]): {
  totalIssues: number;
  errors: number;
  warnings: number;
  issuesByType: Record<string, number>;
  affectedElements: Array<{element: string, issues: string[]}>;
} {
  const issueChecks = elementChecks.filter(check => check.status !== 'pass');
  
  const report = {
    totalIssues: issueChecks.length,
    errors: issueChecks.filter(check => check.status === 'fail').length,
    warnings: issueChecks.filter(check => check.status === 'warning').length,
    issuesByType: {} as Record<string, number>,
    affectedElements: [] as Array<{element: string, issues: string[]}>
  };
  
  // Count issues by type
  issueChecks.forEach(check => {
    check.issues.forEach(issue => {
      const issueType = issue.split(' (')[0];
      report.issuesByType[issueType] = (report.issuesByType[issueType] || 0) + 1;
    });
    
    // Add element info
    const elementTag = check.element.tagName.toLowerCase();
    const elementId = check.element.id ? `#${check.element.id}` : '';
    const elementClass = check.element.className ? `.${check.element.className.split(' ')[0]}` : '';
    const elementIdentifier = `${elementTag}${elementId}${elementClass}`;
    
    report.affectedElements.push({
      element: elementIdentifier,
      issues: check.issues
    });
  });
  
  return report;
}