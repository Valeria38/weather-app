import '@testing-library/jest-dom/vitest'

globalThis.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

if (typeof window !== 'undefined') {
    class MockPointerEvent extends Event {
        button: number;
        ctrlKey: boolean;
        pointerType: string;
        constructor(type: string, props: PointerEventInit = {}) {
            super(type, props);
            this.button = props.button || 0;
            this.ctrlKey = props.ctrlKey || false;
            this.pointerType = props.pointerType || 'mouse';
        }
    }
    window.PointerEvent = MockPointerEvent as unknown as typeof window.PointerEvent;
}

if (typeof window !== 'undefined') {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => { };
    Element.prototype.releasePointerCapture = () => { };
    Element.prototype.scrollIntoView = () => { };
}