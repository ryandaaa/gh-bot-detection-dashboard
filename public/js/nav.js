/**
 * GH Intelligence Dashboard - Navigation & Responsive Mobile Drawer
 * Handles:
 * 1. Responsive mobile drawer (slide-in from left with dark backdrop)
 * 2. Mobile hamburger button injection and toggle handlers
 * 3. Standardization of navigation links (Overview, Accounts, Clusters, Evaluation, Methodology)
 * 4. Automatic active menu highlighting based on current URL
 */

(function () {
  'use strict';

  function initNavigation() {
    const aside = document.querySelector('aside');
    if (!aside) return;

    // --- 1. Responsive Layout & Mobile Drawer Setup ---
    aside.classList.add('sidebar-drawer', 'transition-transform', 'duration-300', 'ease-in-out');
    // Ensure hidden by default on mobile, visible on lg screens
    if (window.innerWidth < 1024) {
      aside.classList.add('-translate-x-full');
    }
    aside.classList.add('lg:translate-x-0');

    // Adjust layout content wrapper and header for mobile responsiveness
    const contentWrapper = document.querySelector('.pl-\\[260px\\]');
    if (contentWrapper) {
      contentWrapper.classList.add('layout-content-wrapper', 'max-lg:pl-0', 'transition-all', 'duration-300');
    }

    const header = document.querySelector('header');
    if (header) {
      header.classList.add('layout-header', 'max-lg:left-0', 'transition-all', 'duration-300');
    }

    // Create Backdrop Overlay if it doesn't exist
    let backdrop = document.getElementById('nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'nav-backdrop';
      backdrop.className = 'fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity duration-300 opacity-0 pointer-events-none lg:hidden';
      document.body.appendChild(backdrop);
    }

    // Inject Mobile Close Button inside Aside Brand Header
    const asideBrand = aside.querySelector('.h-16');
    if (asideBrand && !aside.querySelector('#close-drawer-btn')) {
      const closeBtn = document.createElement('button');
      closeBtn.id = 'close-drawer-btn';
      closeBtn.type = 'button';
      closeBtn.className = 'lg:hidden ml-auto p-1.5 text-secondary hover:text-on-surface hover:bg-surface-hover rounded-lg transition-colors focus:outline-none';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">close</span>';
      asideBrand.appendChild(closeBtn);

      closeBtn.addEventListener('click', closeDrawer);
    }

    // Inject Hamburger Button in Header if not present
    if (header && !document.getElementById('mobile-menu-btn')) {
      const leftHeaderContainer = header.querySelector('.flex.items-center') || header.firstElementChild;
      if (leftHeaderContainer) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.id = 'mobile-menu-btn';
        hamburgerBtn.type = 'button';
        hamburgerBtn.className = 'lg:hidden p-1.5 -ml-1 mr-2 text-on-surface hover:bg-surface-hover rounded-lg flex items-center justify-center transition-colors focus:outline-none';
        hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
        hamburgerBtn.innerHTML = '<span class="material-symbols-outlined text-[24px]">menu</span>';

        leftHeaderContainer.insertBefore(hamburgerBtn, leftHeaderContainer.firstChild);
        hamburgerBtn.addEventListener('click', openDrawer);
      }
    }

    function openDrawer() {
      aside.classList.remove('-translate-x-full');
      aside.classList.add('translate-x-0', 'drawer-open');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100', 'pointer-events-auto');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      aside.classList.remove('translate-x-0', 'drawer-open');
      aside.classList.add('-translate-x-full');
      backdrop.classList.remove('opacity-100', 'pointer-events-auto');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }

    backdrop.addEventListener('click', closeDrawer);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aside.classList.contains('drawer-open')) {
        closeDrawer();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        aside.classList.remove('-translate-x-full');
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      } else if (!aside.classList.contains('drawer-open')) {
        aside.classList.add('-translate-x-full');
      }
    });

    // --- 2. Standardize Navigation Links ---
    const isFileOrHtml = window.location.protocol === 'file:' || window.location.pathname.endsWith('.html');

    const routeMap = {
      overview: isFileOrHtml ? 'overview.html' : '/',
      accounts: isFileOrHtml ? 'account_explorer.html' : '/accounts',
      clusters: isFileOrHtml ? 'cluster.html' : '/clusters',
      evaluation: isFileOrHtml ? 'evaluation.html' : '/evaluation',
      methodology: isFileOrHtml ? 'methodology.html' : '/methodology',
    };

    // Determine current active section
    const currentPath = window.location.pathname.toLowerCase();
    let activeKey = 'overview';

    if (currentPath.includes('account')) {
      activeKey = 'accounts';
    } else if (currentPath.includes('cluster')) {
      activeKey = 'clusters';
    } else if (currentPath.includes('eval')) {
      activeKey = 'evaluation';
    } else if (currentPath.includes('method')) {
      activeKey = 'methodology';
    } else {
      activeKey = 'overview';
    }

    const navLinks = aside.querySelectorAll('nav a[data-path]');
    navLinks.forEach((link) => {
      const pathKey = link.getAttribute('data-path');

      // Standardize href
      if (routeMap[pathKey]) {
        link.setAttribute('href', routeMap[pathKey]);
      }

      // Close drawer on link click in mobile view
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          closeDrawer();
        }
      });

      // --- 3. Active Menu Highlighting ---
      const activeClasses = ['bg-surface-hover', 'text-on-surface', 'font-semibold', 'border-r-2', 'border-primary'];
      const inactiveClasses = ['text-on-surface-variant', 'font-label-md'];

      if (pathKey === activeKey) {
        link.setAttribute('aria-current', 'page');
        link.classList.remove(...inactiveClasses);
        link.classList.add(...activeClasses);
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove(...activeClasses);
        link.classList.add(...inactiveClasses, 'hover:bg-surface-hover', 'hover:text-on-surface', 'transition-colors');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
