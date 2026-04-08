document.addEventListener('DOMContentLoaded', () => {
    const selectors = [
        '.single-content article h1[id]',
        '.single-content article h2[id]',
        '.single-content article h3[id]',
        '.single-content article h4[id]',
        '.single-content article h5[id]',
        '.single-content article h6[id]'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach((heading) => {
        if (heading.querySelector('.heading-anchor')) {
            return;
        }

        const anchor = document.createElement('a');
        anchor.className = 'heading-anchor';
        anchor.href = `#${heading.id}`;
        anchor.setAttribute('aria-label', `Link to section: ${heading.textContent.trim()}`);
        anchor.textContent = '#';

        heading.append(' ', anchor);
    });
});
