let globals = {
    get recursiveHighlight(): boolean {
        let el = document.getElementById("recursiveHighlight") as HTMLInputElement | null;
        if (!el) return false;
        return el.checked;
    },
    set recursiveHighlight(value: boolean) {
        let el = document.getElementById("recursiveHighlight") as HTMLInputElement | null;
        if (!el) return;
        el.checked = value;
    }
}