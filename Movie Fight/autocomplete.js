

const createAutocomplete = (({root, fetchData, renderOption, value, onOptionSelect}) => {
    // ({root, fetchData, renderOption, value, onOptionSelect}) = config; - így nem működik
    // root = config.root; // - így működni látszik. De nagyon érdekes mert mégis problémás, a bal oldalit is jobbra teszi, a részleteket, így.
    // fetchData = config.fetchData;
    // renderOption=config.renderOption;
    // value=config.value;
    // onOptionSelect=config.onOptionSelect;

    root.innerHTML=`
        <p><b>Search</b></p>
            <input class="input" type="text" name="inp" id="inpu" />
            <div class="dropdown">
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                </div>
            </div>
        </div>`;
         
    const drop = root.querySelector(".dropdown");
    const input = root.querySelector("input");
    const dropContent = root.querySelector(".dropdown-content");

    const onInput = async() => {

        if (!input.value) {
            drop.classList.remove("is-active");
            return;
        };

        dropContent.innerHTML="";
        
        const results = await fetchData(input.value); // mi történjen hogyha beírsz valamit, hova/mire keressen rá
        
        if (!results) {
            drop.classList.remove("is-active");
            console.log("No results found :(");
        }
        else {
            drop.classList.add("is-active");
            results.forEach((result) => {
                const newItem = document.createElement("a");
                newItem.classList.add("dropdown-item");
                newItem.innerHTML=renderOption(result); // mi kerüljön bele mint tartalom a listába elemenként
    
                dropContent.append(newItem);

                newItem.addEventListener("click", () => {
                    drop.classList.remove("is-active");
                    input.value=value(result);

                    onOptionSelect(result); // mi történjen specifiksuan, hogyha egy kilistázott opcióra rákattintasz
                });
            });
        };
    };

    input.addEventListener("input", debounce(onInput, 500)); // kihelyezve "utilities"-be
    
    document.addEventListener("click", (event) => {
        if (!(input.contains(event.target)) && !(drop.contains(event.target))) {
            drop.classList.remove("is-active");
        };
        if (input.value && input.contains(event.target)) {
            drop.classList.add("is-active");
        };
    });
});