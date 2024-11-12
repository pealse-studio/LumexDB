export declare function setVar(type: string, name: string, value: string, id?: string): void;
export declare function deleteVar(type: string, name: string, id?: string): void;
export declare function getVar(type: string, name: string, id?: string): any;
export declare function toggleVar(type: string, name: string, id?: string): boolean | undefined;
export declare function filterVar(type?: string, name?: string, value?: string, id?: string, guild?: string): string | undefined;
export declare function resetVar(type: string, reset: string, id?: string): Promise<void>;
export declare function optimizationVar(): void;
export declare function updateVar(): void;
export declare function createFiles(): void;
//# sourceMappingURL=database.d.ts.map