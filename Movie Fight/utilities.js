
function debounce(func, delay=1000) {
    let id;
    return () => {
        if (id) {
            clearTimeout(id);
        }
        id = setTimeout(() => {
            func();
        }, delay);
    }  
}; 