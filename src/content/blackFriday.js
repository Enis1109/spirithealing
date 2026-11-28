// The booking deadline is independent of the appointment date.
export const blackFridayEndsAt = Date.parse('2026-12-01T00:00:00+01:00');
export const blackFridayIsActive = (now = Date.now()) => now < blackFridayEndsAt;
export const blackFridaySessions = [
    { title: 'Erstsitzung mit Sabine', price: '155,40 €', regular: '222 €', code: 'BLACK30SABINE', href: 'https://calendly.com/spirit-healing/einzelsitzung-sabine' },
    { title: 'Folgesitzung mit Sabine', price: '155,40 €', regular: '222 €', code: 'BLACK30SABINEFOLGE', href: 'https://calendly.com/spirit-healing/folgesitzung-sabine' },
    { title: 'Erstsitzung mit Selcan', price: '155,40 €', regular: '222 €', code: 'BLACK30SELCAN', href: 'https://calendly.com/selcan1975/erstsitzung-selcan' },
    { title: 'Folgesitzung mit Selcan', price: '155,40 €', regular: '222 €', code: 'BLACK30SELCANFOLGE', href: 'https://calendly.com/selcan1975/folgesitzung-selcan' },
    { title: 'Erstsitzung mit Sabine & Selcan', price: '233,10 €', regular: '333 €', code: 'BLACK30GEMEINSAM', href: 'https://calendly.com/d/ct8z-zk5-7yc/gemeinsame-erstsitzung' },
    { title: 'Folgesitzung mit Sabine & Selcan', price: '233,10 €', regular: '333 €', code: 'BLACK30FOLGE', href: 'https://calendly.com/d/cvrv-kgh-zvr/gemeinsame-folgesitzung' },
];
