/// <reference types="vite/client" />

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

/// <reference types="vite-plugin-pwa/client" />