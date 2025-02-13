document.addEventListener('DOMContentLoaded', () => {
    const countersContainer = document.getElementById('counters-container');
    const addCounterButton = document.getElementById('add-counter');
    const resetAllCountersButton = document.getElementById('reset-all-counters');
    const exportListButton = document.getElementById('export-list');
    const importConfigButton = document.getElementById('import-config');
    const exportConfigButton = document.getElementById('export-config');
    const addTitleButton = document.getElementById('add-title');
    const additionalSettingsButton = document.getElementById('additional-settings');

    // Create modal for setting counter value
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Set Counter Value</h2>
            <input type="number" id="modal-input" placeholder="Enter new value">
            <button id="modal-ok">OK</button>
            <button id="modal-cancel">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Create modal for resetting all counters
    const resetModal = document.createElement('div');
    resetModal.className = 'modal';
    resetModal.innerHTML = `
        <div class="modal-content">
            <h2>Are you sure you want to reset all counters?</h2>
            <button id="reset-yes">Yes</button>
            <button id="reset-no">No</button>
        </div>
    `;
    document.body.appendChild(resetModal);

    // Create modal for exporting list
    const exportModal = document.createElement('div');
    exportModal.className = 'modal';
    exportModal.innerHTML = `
        <div class="modal-content">
            <h2>Export List</h2>
            <textarea id="export-textarea" rows="10"></textarea>
            <button id="copy-button" class="copy-button">Copy</button>
        </div>
    `;
    document.body.appendChild(exportModal);

    // Create modal for setting custom unit
    const unitModal = document.createElement('div');
    unitModal.className = 'modal';
    unitModal.innerHTML = `
        <div class="modal-content">
            <h2>Set Custom Unit</h2>
            <input type="text" id="unit-input" placeholder="Enter custom unit">
            <button id="unit-ok">OK</button>
            <button id="unit-cancel">Cancel</button>
        </div>
    `;
    document.body.appendChild(unitModal);

    // Create modal for exporting config
    const exportConfigModal = document.createElement('div');
    exportConfigModal.className = 'modal';
    exportConfigModal.innerHTML = `
        <div class="modal-content">
            <h2>Export Config</h2>
            <textarea id="export-config-textarea" rows="10" readonly></textarea>
            <button id="copy-config-button" class="copy-button">Copy</button>
        </div>
    `;
    document.body.appendChild(exportConfigModal);

    // Create modal for importing config
    const importConfigModal = document.createElement('div');
    importConfigModal.className = 'modal';
    importConfigModal.innerHTML = `
        <div class="modal-content">
            <h2>Import Config</h2>
            <textarea id="import-config-textarea" rows="10" placeholder="Paste JSON config here"></textarea>
            <button id="import-config-button">Import</button>
        </div>
    `;
    document.body.appendChild(importConfigModal);

    // Create modal for adding title for export list
    const addTitleModal = document.createElement('div');
    addTitleModal.className = 'modal';
    addTitleModal.innerHTML = `
        <div class="modal-content">
            <h2>Add Title for Export List</h2>
            <input type="text" id="title-input" placeholder="Enter title">
            <button id="title-ok">OK</button>
            <button id="title-cancel">Cancel</button>
        </div>
    `;
    document.body.appendChild(addTitleModal);

    // Create modal for additional settings
    const settingsModal = document.createElement('div');
    settingsModal.className = 'modal';
    settingsModal.innerHTML = `
        <div class="modal-content">
            <h2>Additional Settings</h2>
            <label class="switch">
                <input type="checkbox" id="auto-add-s">
                <span class="slider"></span>
            </label>
            <span>Auto Add 's' to Custom Unit</span>
            <button id="settings-ok">OK</button>
            <button id="settings-cancel">Cancel</button>
        </div>
    `;
    document.body.appendChild(settingsModal);

    const modalInput = document.getElementById('modal-input');
    const modalOkButton = document.getElementById('modal-ok');
    const modalCancelButton = document.getElementById('modal-cancel');
    const resetYesButton = document.getElementById('reset-yes');
    const resetNoButton = document.getElementById('reset-no');
    const exportTextarea = document.getElementById('export-textarea');
    const copyButton = document.getElementById('copy-button');
    const unitInput = document.getElementById('unit-input');
    const unitOkButton = document.getElementById('unit-ok');
    const unitCancelButton = document.getElementById('unit-cancel');
    const exportConfigTextarea = document.getElementById('export-config-textarea');
    const copyConfigButton = document.getElementById('copy-config-button');
    const importConfigTextarea = document.getElementById('import-config-textarea');
    const importConfigButtonModal = document.getElementById('import-config-button');
    const titleInput = document.getElementById('title-input');
    const titleOkButton = document.getElementById('title-ok');
    const titleCancelButton = document.getElementById('title-cancel');
    const autoAddSCheckbox = document.getElementById('auto-add-s');
    const settingsOkButton = document.getElementById('settings-ok');
    const settingsCancelButton = document.getElementById('settings-cancel');

    let currentCounterValueElement = null;
    let currentCounterUnitElement = null;

    // Load settings from localStorage
    let autoAddSSetting = localStorage.getItem('autoAddS') === 'true';
    autoAddSCheckbox.checked = autoAddSSetting;

    // Load counters and title from localStorage
    const savedCounters = JSON.parse(localStorage.getItem('counters')) || [];
    let savedTitle = localStorage.getItem('exportTitle') || '';
    savedCounters.forEach(counter => addCounter(counter.title, counter.value, counter.unit));

    addCounterButton.addEventListener('click', () => {
        addCounter('New Counter', 0, '');
    });

    resetAllCountersButton.addEventListener('click', () => {
        resetModal.style.display = 'block';
    });

    resetYesButton.addEventListener('click', () => {
        document.querySelectorAll('.counter-module .counter-value').forEach(counterValue => {
            counterValue.textContent = 0;
        });
        saveCounters();
        resetModal.style.display = 'none';
    });

    resetNoButton.addEventListener('click', () => {
        resetModal.style.display = 'none';
    });

    exportListButton.addEventListener('click', () => {
        autoAddSSetting = localStorage.getItem('autoAddS') === 'true'; // Refresh setting
        let exportText = savedTitle ? `${savedTitle}\n` : '';
        let exportIndex = 1;
        const modules = document.querySelectorAll('.counter-module');
        const nonZeroModules = Array.from(modules).filter(module => parseInt(module.querySelector('.counter-value').textContent) !== 0);
        nonZeroModules.forEach((module, index) => {
            const title = module.querySelector('.title').textContent;
            const value = module.querySelector('.counter-value').textContent;
            let unit = module.querySelector('.counter-unit').textContent;
            if (autoAddSSetting && parseInt(value) > 1 && unit) {
                unit += 's';
            }
            exportText += `${exportIndex}. ${title} (${value}${unit ? ' ' + unit : ''})`;
            if (index < nonZeroModules.length - 1) {
                exportText += '\n';
            }
            exportIndex++;
        });
        exportTextarea.value = exportText;
        exportModal.style.display = 'block';
    });

    copyButton.addEventListener('click', () => {
        exportTextarea.select();
        document.execCommand('copy');
    });

    exportConfigButton.addEventListener('click', () => {
        const counters = JSON.parse(localStorage.getItem('counters')) || [];
        const autoAddS = localStorage.getItem('autoAddS') === 'true';
        const config = { counters, exportTitle: savedTitle, autoAddS };
        exportConfigTextarea.value = JSON.stringify(config, null, 2);
        exportConfigModal.style.display = 'block';
    });

    copyConfigButton.addEventListener('click', () => {
        exportConfigTextarea.select();
        document.execCommand('copy');
    });

    importConfigButton.addEventListener('click', () => {
        importConfigModal.style.display = 'block';
    });

    importConfigButtonModal.addEventListener('click', () => {
        const configText = importConfigTextarea.value;
        try {
            const config = JSON.parse(configText);
            if (config && Array.isArray(config.counters) && typeof config.exportTitle === 'string' && typeof config.autoAddS === 'boolean') {
                const { counters, exportTitle, autoAddS } = config;
                localStorage.setItem('counters', JSON.stringify(counters));
                localStorage.setItem('exportTitle', exportTitle || '');
                localStorage.setItem('autoAddS', autoAddS);
                countersContainer.innerHTML = '';
                counters.forEach(counter => addCounter(counter.title, counter.value, counter.unit));
                savedTitle = exportTitle || ''; // Update savedTitle
                autoAddSCheckbox.checked = autoAddS; // Update autoAddS setting
                importConfigModal.style.display = 'none';
            } else {
                throw new Error('Invalid config structure');
            }
        } catch (e) {
            alert('Invalid JSON format or structure');
        }
    });

    addTitleButton.addEventListener('click', () => {
        addTitleModal.style.display = 'block';
        titleInput.value = savedTitle;
    });

    titleOkButton.addEventListener('click', () => {
        const newTitle = titleInput.value;
        localStorage.setItem('exportTitle', newTitle);
        savedTitle = newTitle; // Update savedTitle
        addTitleModal.style.display = 'none';
    });

    titleCancelButton.addEventListener('click', () => {
        addTitleModal.style.display = 'none';
    });

    additionalSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    settingsOkButton.addEventListener('click', () => {
        const autoAddS = autoAddSCheckbox.checked;
        localStorage.setItem('autoAddS', autoAddS);
        autoAddSSetting = autoAddS; // Update setting immediately
        settingsModal.style.display = 'none';
    });

    settingsCancelButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === resetModal) {
            resetModal.style.display = 'none';
        }
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
        if (event.target === unitModal) {
            unitModal.style.display = 'none';
        }
        if (event.target === exportConfigModal) {
            exportConfigModal.style.display = 'none';
        }
        if (event.target === importConfigModal) {
            importConfigModal.style.display = 'none';
        }
        if (event.target === addTitleModal) {
            addTitleModal.style.display = 'none';
        }
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    function addCounter(title, value, unit) {
        const counterModule = document.createElement('div');
        counterModule.className = 'counter-module';

        const menuButton = document.createElement('button');
        menuButton.className = 'menu-button';
        menuButton.textContent = '⋮';
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closeAllDropdowns();
            menuDropdown.classList.toggle('show');
        });
        counterModule.appendChild(menuButton);

        const counterTitle = document.createElement('div');
        counterTitle.className = 'title';
        counterTitle.contentEditable = true;
        counterTitle.textContent = title;
        counterTitle.addEventListener('input', () => {
            adjustTitleWidth(counterTitle);
            saveCounters();
        }); // Save on title edit
        counterModule.appendChild(counterTitle);

        const menuDropdown = document.createElement('div');
        menuDropdown.className = 'menu-dropdown';
        menuDropdown.innerHTML = `
            <button class="set-counter">Set Counter</button>
            <button class="reset-counter">Reset Counter</button>
            <button class="delete-counter">Delete Counter</button>
            <button class="set-unit">Use Custom Unit</button>
        `;
        counterModule.appendChild(menuDropdown);

        const counterValue = document.createElement('div');
        counterValue.className = 'counter-value';
        counterValue.textContent = value;
        counterModule.appendChild(counterValue);

        const counterUnit = document.createElement('div');
        counterUnit.className = 'counter-unit';
        counterUnit.textContent = unit;
        counterModule.appendChild(counterUnit);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons';

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener('click', () => {
            counterValue.textContent = parseInt(counterValue.textContent) - 1;
            saveCounters();
        });
        buttonsContainer.appendChild(decreaseButton);

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.addEventListener('click', () => {
            counterValue.textContent = parseInt(counterValue.textContent) + 1;
            saveCounters();
        });
        buttonsContainer.appendChild(increaseButton);

        counterModule.appendChild(buttonsContainer);
        countersContainer.appendChild(counterModule);
        adjustTitleWidth(counterTitle);
        saveCounters();

        // Add event listeners for menu options
        menuDropdown.querySelector('.set-counter').addEventListener('click', () => {
            currentCounterValueElement = counterValue;
            modal.style.display = 'block';
            modalInput.value = counterValue.textContent;
            menuDropdown.classList.remove('show');
        });

        menuDropdown.querySelector('.reset-counter').addEventListener('click', () => {
            counterValue.textContent = 0;
            saveCounters();
            menuDropdown.classList.remove('show');
        });

        menuDropdown.querySelector('.delete-counter').addEventListener('click', () => {
            counterModule.remove();
            saveCounters();
        });

        menuDropdown.querySelector('.set-unit').addEventListener('click', () => {
            currentCounterUnitElement = counterUnit;
            unitModal.style.display = 'block';
            unitInput.value = counterUnit.textContent;
            menuDropdown.classList.remove('show');
        });
    }

    modalOkButton.addEventListener('click', () => {
        if (currentCounterValueElement) {
            currentCounterValueElement.textContent = parseInt(modalInput.value);
            saveCounters();
        }
        modal.style.display = 'none';
    });

    modalCancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    unitOkButton.addEventListener('click', () => {
        if (currentCounterUnitElement) {
            currentCounterUnitElement.textContent = unitInput.value;
            saveCounters();
        }
        unitModal.style.display = 'none';
    });

    unitCancelButton.addEventListener('click', () => {
        unitModal.style.display = 'none';
    });

    function saveCounters() {
        const counters = [];
        document.querySelectorAll('.counter-module').forEach(module => {
            const title = module.querySelector('.title').textContent;
            const value = parseInt(module.querySelector('.counter-value').textContent);
            const unit = module.querySelector('.counter-unit').textContent;
            counters.push({ title, value, unit });
        });
        localStorage.setItem('counters', JSON.stringify(counters));
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    function adjustTitleWidth(titleElement) {
        const parentWidth = titleElement.parentElement.clientWidth * 0.8; // 80% of parent width
        let fontSize = parseFloat(window.getComputedStyle(titleElement).fontSize);

        while (titleElement.scrollWidth > parentWidth && fontSize > 10) { // Minimum font size of 10px
            fontSize -= 1;
            titleElement.style.fontSize = `${fontSize}px`;
        }
    }

    document.addEventListener('click', closeAllDropdowns);
});