document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const header = document.querySelector('.site-header');
    const mainContainer = document.querySelector('.main-container');

    if (!header || !mainContainer) {
        return;
    }

    const syncStickyOffset = () => {
        const styles = window.getComputedStyle(mainContainer);
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const offset = Math.ceil(header.getBoundingClientRect().height + paddingTop);
        root.style.setProperty('--profile-sticky-top', `${offset}px`);
    };

    syncStickyOffset();
    window.addEventListener('resize', syncStickyOffset);
});
