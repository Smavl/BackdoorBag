// Wordslists
const wordlists = {
    // Web
    "raft-large-directories": "/usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt",
    "raft-large-files": "/usr/share/seclists/Discovery/Web-Content/raft-large-files.txt",
    "n0kovo_subdomains.txt": "/usr/share/seclists/Discovery/DNS/n0kovo_subdomains.txt",
    // Fuzzing
    "param-names": "/usr/share/seclists/Discovery/Web-Content/param-names.txt",
    "param-values": "/usr/share/seclists/Discovery/Web-Content/param-values.txt",
    "rockyou": "/usr/share/wordlists/rockyou.txt",
    "big-list-of-naughty-strings.txt": "/usr/share/seclists/Fuzzing/big-list-of-naughty-strings.txt",
}

// Commands array
const commands = [
    // **** WEB DISCOVERY COMMANDS ****
    { // fuff dir discovery
        id: "fuff_dir_discovery",
        description: "Directory discovery using ffuf",
        command: "ffuf -w {{wordlist}} -u http://{{target_domain}}/FUZZ",
        tool: "ffuf",
        category: "Web Discovery",
        tags: ["brute force", "web"],
        default_wordlist: wordlists["raft-large-directories"]
    },
    // gobuster dir discovery
    {
        id: "gobuster_dir_discovery",
        description: "Directory discovery using gobuster",
        command: "gobuster dir -u http://{{target_domain}} -w {{wordlist}}",
        tool: "gobuster",
        category: "Web Discovery",
        tags: ["brute force", "web"],
        default_wordlist: wordlists["raft-large-directories"]
    },
    // ffuf subdomain discovery
    {
        id: "fuff_subdomain_discovery",
        description: "Subdomain discovery using ffuf",
        command: "ffuf -w {{wordlist}} -u http://{{target_domain}} -H \"Host: FUZZ.{{target_domain}}\" -fs 4242",
        tool: "ffuf",
        category: "DNS And VHOST Discovery",
        tags: ["subdomain discovery", "dns"],
        default_wordlist: wordlists["n0kovo_subdomains.txt"]
    },
    // ffuf vhost discovery
    // Delete?
    {
        id: "ffuf_vhost_discovery",
        description: "Virtual host discovery (without DNS records)",
        command: "ffuf -w {{wordlist}} -u http://{{target_ip}} -H \"Host: FUZZ\" -fs 4242",
        tool: "ffuf",
        category: "DNS And VHOST Discovery",
        tags: ["vhost discovery", "dns"],
        default_wordlist: wordlists["n0kovo_subdomains.txt"]
    },
    // gobuster vhost discovery
    {
        id: "gobuster_vhost_discovery",
        description: "Virtual host discovery using gobuster",
        command: "gobuster vhost -u {{target_ip}} -w {{wordlist}}",
        tool: "gobuster",
        category: "DNS And VHOST Discovery",
        tags: ["vhost discovery", "dns"],
        default_wordlist: wordlists["n0kovo_subdomains.txt"]
    },
    // gobuster subdomain discovery
    {
        id: "gobuster_subdomain_discovery",
        description: "Subdomain discovery using gobuster",
        command: "gobuster dns -d {{target_domain}} -w {{wordlist}}",
        tool: "gobuster",
        category: "DNS And VHOST Discovery",
        tags: ["subdomain discovery", "dns"],
        default_wordlist: wordlists["n0kovo_subdomains.txt"]
    },
    // **** WEB SCANNING COMMANDS ****
    {
        id: "get_param_fuzz",
        description: "GET param fuzzing, filtering for invalid response size",
        command: "ffuf -w {{wordlist}} -u http://{{target_domain}}/index.php?FUZZ=42 -fs 4242",
        tool: "ffuf",
        category: "Parameter fuzzing",
        tags: ["get param", "response filtering"],
        default_wordlist: wordlists["param-names"]
    },
    {
        id: "get_param_values",
        description: "GET parameter fuzzing if the param is known (fuzzing values) and filtering 401",
        command: "ffuf -w {{wordlist}} -u http://{{target_domain}}/script.php?valid_name=FUZZ -fc 401",
        tool: "ffuf",
        category: "Parameter fuzzing",
        tags: ["get param", "filter 401"],
        default_wordlist: wordlists["param-values"]
    },
    {
        id: "post_param_fuzz",
        description: "POST parameter fuzzing with filtering for status code 401",
        command: "ffuf -w {{wordlist}} -X POST -d \"username=admin\\&password=FUZZ\" -u http://{{target_domain}}/login.php -fc 401",
        tool: "ffuf",
        category: ["Authentication", "Parameter fuzzing"],
        tags: ["post param", "filter 401"],
        default_wordlist: wordlists["rockyou"]
    },
    {
        id: "post_json_fuzz",
        description: "Fuzz POST JSON data. Match all responses not containing text 'error'.",
        command: `ffuf -w {{wordlist}} -u http://{{target_domain}}/ -X POST -H "Content-Type: application/json" -d '{"value": "FUZZ", "value2": "anothervalue"}' -fr "error"`,
        tool: "ffuf",
        category: "JSON fuzzing",
        tags: ["post","json", "response filtering"],
        default_wordlist: undefined
    },
    // *** AUTHENTICATION COMMANDS ***
    // Hydra HTTP Basic Auth
    {
        id: "hydra_http_basic_auth",
        description: "Brute force HTTP Basic Auth using Hydra",
        command: "hydra -l {{target_user}} -P {{wordlist}} {{target_ip}} http-get /secret",
        tool: "hydra",
        category: "Authentication",
        tags: ["brute force", "http basic auth"],
        default_wordlist: wordlists["rockyou"]
    },
    /// *** SSH AUTHENTICATION COMMANDS ***
    {
        id: "hydra_ssh_auth",
        description: "Brute force SSH authentication using Hydra",
        command: "hydra -l {{target_user}} -P {{wordlist}} {{target_ip}} ssh",
        tool: "hydra",
        category: "Authentication",
        tags: ["brute force", "ssh"],
        default_wordlist: wordlists["rockyou"]
    },
    // ftp brute force
    {
        id: "hydra_ftp_auth",
        description: "Brute force FTP authentication using Hydra",
        command: "hydra -l {{target_user}} -P {{wordlist}} {{target_ip}} ftp",
        tool: "hydra",
        category: "Authentication",
        tags: ["ftp"],
        default_wordlist: wordlists["rockyou"]
    },
    // *** Linux PrivEsc  ***
    // Filesystem Enumeration
    {
        id: "find_suid",
        description: "Find suid binaries, and hide permission errors",
        command: "find / -perm -4000 2>/dev/null",
        tool: "find",
        category: "Filesystem Enumeration",
        tags: ["linux","find", "Privilege Escalation", "Filesystem Enumeration"],
        default_wordlist: undefined
    },
    {
        id: "root_file_in_home",
        description: "root owned files in /home folders, and hide permission errors",
        command: "find /home -user root 2>/dev/null",
        tool: "find",
        category: "Filesystem Enumeration",
        tags: ["linux","find", "Privilege Escalation", "Filesystem Enumeration", "Permissions"],
        default_wordlist: undefined
    },
    {
        id: "alien_files_in_my_folder",
        description: "Files owned by other users in folders owned by me",
        command: "for d in `find /var /etc /home /root /tmp /usr /opt /boot /sys -type d -user $(whoami) 2>/dev/null`; do find $d ! -user `whoami` -exec ls -l {} \\; 2>/dev/null; done",
        tool: "find",
        category: "Filesystem Enumeration",
        tags: ["linux","find", "Privilege Escalation", "Filesystem Enumeration", "Permissions"],
        default_wordlist: undefined
    },
    {
        id: "root_files_readable_me",
        description: "Files owned by root, readable by me but not world readable",
        command: "find / -type f -user root ! -perm -o=r 2>/dev/null",
        tool: "find",
        category: "Filesystem Enumeration",
        tags: ["linux","find", "Privilege Escalation", "Filesystem Enumeration", "Permissions"],
        default_wordlist: undefined
    },
    {
        id: "files_owned_or_writable",
        description: "Files owned by me or world writable",
        command: "find / '(' -type f -or -type d ')' '(' '(' -user $USER ')' -or '(' -perm -o=w ')' ')' ! -path \"/proc/*\" ! -path \"/sys/*\" ! -path \"$HOME/*\" 2>/dev/null",
        tool: "find",
        category: "Filesystem Enumeration",
        tags: ["linux","find", "Privilege Escalation", "Filesystem Enumeration", "Permissions"],
        default_wordlist: undefined
    },
    {
        id: "writable_user_groups",
        description: "Find files writable by any group of the user",
        command: "for g in `groups`; do find \( -type f -or -type d \) -group $g -perm -g=w 2>/dev/null | grep -v '/proc/' | grep -v $HOME; done",
        tool: "find",
        category: "Filesystem Enumeration",
        tags: ["linux","find", "Privilege Escalation", "Filesystem Enumeration", "Permissions"],
        default_wordlist: undefined
    },
    // Filesystem operations
    {
    id: "copy_bash_to_tmp",
    description: "Copy Bash to /tmp with with root permissions",
    command: [
        "cp /bin/bash /tmp/bash; chmod 4755 /tmp/bash",
        "# to get root shell use -p flag",
        "/tmp/bash -p",
        ],
    tool: "cp/chmod",
    category: "Filesystem Operations",
    tags: ["linux", "copy", "permissions","Privilege Escalation"],
    default_wordlist: undefined
},
];
// 

// Wordlist paths
const wordlistPaths = Object.values(wordlists);

// Input variables configuration 
const inputvariables = [
    { id: "target_ip", label: "Target IP", default: "10.10.10.10" },
    { id: "target_port", label: "Target Port", default: "80" },
    { id: "local_ip", label: "Local Ip", default: "10.10.10.69" },
    { id: "local_port", label: "Local Port", default: "9001" },
    { id: "target_path", label: "Target Path", default: "/" },
    { id: "target_domain", label: "Target Domain", default: "example.com" },
    { id: "target_user", label: "Target User", default: "admin" },
    { id: "target_pass", label: "Target Password", default: "password" },
    // { id: "wordlist", label: "Wordlist Path", default: wordlistPaths[0] } 
    { id: "wordlist", label: "Wordlist Path", default: null } 
];

// Save the active tab to localStorage
function saveActiveTab(tabId) {
    localStorage.setItem("activeTab", tabId);
}

// Load the active tab from localStorage
function loadActiveTab() {
    const savedTabId = localStorage.getItem("activeTab");
    if (savedTabId) {
        $(`#${savedTabId}`).tab("show"); // Activate the saved tab
    }
}

// Set up tab change listener to save the active tab
function setupTabChangeListener() {
    $("#pills-tab").on("shown.bs.tab", function (event) {
        const activeTabId = $(event.target).attr("id"); // Get the ID of the active tab
        saveActiveTab(activeTabId);
    });
}

// Initialize the application
$(document).ready(function () {
    loadInputValuesFromLocalStorage(); // Load saved input values
    generateInputFields();
    generateTabsAndContent();
    applyDefaultValues();
    applyLocalValues();
    setupInputChangeListener();
    setupInlineVariableEditing();
    setupClipboardButtons();
    setupTabChangeListener(); // Set up tab persistence
    loadActiveTab(); // Load the last active tab

    const wordlistDropdown = $("#wordlist").siblings(".dropdown-menu");
    const wordlistInput = $("#wordlist");

    // Handle dropdown selection
    wordlistDropdown.on("click", "a", function (event) {
        event.preventDefault();
        const selectedValue = $(this).data("value");

        if (selectedValue === "custom") {
            wordlistInput.val(""); // Clear the input field for custom entry
            wordlistInput.focus(); // Focus the input field
        } else {
            wordlistInput.val(selectedValue); // Set the selected wordlist value
        }

        updateCommands(); // Update commands dynamically
        saveInputValuesToLocalStorage(); // Save the updated wordlist to localStorage
    });

    // Add event listener for the reset button
    $("#resetButton").on("click", function () {
        resetInputValuesToDefault();
    });

    setupHoverExpand(); // Set up hover expand functionality
});

// Load input values from localStorage
function loadInputValuesFromLocalStorage() {
    inputvariables.forEach(variable => {
        const savedValue = localStorage.getItem(variable.id);
        if (savedValue !== null) {
            $(`#${variable.id}`).val(savedValue); // Set the value in the input field
        }
    });
}

// Save input values to localStorage
function saveInputValuesToLocalStorage() {
    inputvariables.forEach(variable => {
        const value = $(`#${variable.id}`).val();
        localStorage.setItem(variable.id, value); // Save the value to localStorage
    });
}

// Generate input fields dynamically
function generateInputFields() {
    const inputSection = $("#inputSection");
    inputvariables.forEach(variable => {
        const field = createInputField(variable.id, variable.label, variable.default);
        inputSection.append(field);
    });

    // Add the reset button
    inputSection.append(`
        <div class="mb-3">
            <button id="resetButton" class="btn btn-danger btn-sm">Reset to Default</button>
        </div>
    `);
}

// Create a single input field
function createInputField(id, label, defaultValue) {
    if (id === "wordlist") {
        // Generate dropdown items dynamically from wordlistPaths
        const dropdownItems = wordlistPaths.map(path => `
            <li><a class="dropdown-item" href="#" data-value="${path}">${path.split('/').pop()}</a></li>
        `).join("");

        return `
            <div class="mb-3 col-auto align-items-left">
                <label for="${id}" class="form-label">${label}</label>
                <div class="input-group hover-expand">
                    <button type="button" class="btn btn-secondary btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu">
                        ${dropdownItems}
                    </ul>
                    <input type="text" class="form-control " id="${id}" placeholder="Enter wordlist path" value="${defaultValue}">
                </div>
            </div>
        `;
    } else {
        return `
            <div class="mb-3 col-auto">
                <label for="${id}" class="form-label">${label}</label>
                <input type="text" class="form-control" id="${id}" placeholder="${label}" value="${defaultValue}">
            </div>
        `;
    }
}

// Generate tabs and their content dynamically based on categories
function generateTabsAndContent() {
    const tabList = $("#pills-tab");
    const tabContent = $("#pills-tabContent");
    const uniqueCategories = getUniqueCategories();

    uniqueCategories.forEach((category, index) => {
        const tabId = formatCategoryToId(category);

        // Create and append the tab button
        const tabButton = createTabButton(tabId, category, index === 0);
        tabList.append(tabButton);

        // Create and append the tab content
        const tabPane = createTabContent(tabId, category, index === 0);
        tabContent.append(tabPane);
    });
}

// Get unique categories from the commands array
function getUniqueCategories() {
    const allCategories = commands.flatMap(command => command.category);
    return [...new Set(allCategories)];
}

// Format a category into a valid ID
function formatCategoryToId(category) {
    return `pills-${category.replace(/\s+/g, "-").toLowerCase()}`;
}

// Commands can be defined as a string or as one line per array item.
function commandToString(command) {
    if (Array.isArray(command)) {
        return command.join("\n");
    }

    return command ?? "";
}

function escapeHtml(value) {
    const htmlEntities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return String(value).replace(/[&<>"']/g, character => htmlEntities[character]);
}

function getCommandValues(command, values) {
    return {
        ...values,
        wordlist: values.wordlist || command.default_wordlist || ""
    };
}

function renderCommandTemplate(command, values) {
    const template = commandToString(command);
    const variablePattern = /{{([a-zA-Z0-9_]+)}}/g;
    let renderedCommand = "";
    let previousMatchEnd = 0;

    template.replace(variablePattern, (placeholder, variableId, matchIndex) => {
        renderedCommand += escapeHtml(template.slice(previousMatchEnd, matchIndex));

        const variable = inputvariables.find(item => item.id === variableId);
        const hasValue = Object.prototype.hasOwnProperty.call(values, variableId);
        const value = hasValue ? values[variableId] ?? "" : placeholder;

        if (variable) {
            const escapedVariableId = escapeHtml(variableId);
            const escapedValue = escapeHtml(value);
            const escapedLabel = escapeHtml(variable.label);

            renderedCommand += `<span class="editable-variable" data-variable-id="${escapedVariableId}" tabindex="0" role="button" title="Click to edit ${escapedLabel}" aria-label="Edit ${escapedLabel}">${escapedValue}</span>`;
        } else {
            renderedCommand += escapeHtml(value);
        }

        previousMatchEnd = matchIndex + placeholder.length;
        return placeholder;
    });

    return renderedCommand + escapeHtml(template.slice(previousMatchEnd));
}

// Create a tab button
function createTabButton(tabId, category, isActive) {
    // Define icons for different categories
    const iconMap = {
        "Web Discovery": "fa-search",
        "VHOST Discovery": "fa-server",
        "Parameter fuzzing": "fa-code",
        "JSON fuzzing": "fa-brackets-curly",
        "Authentication": "fa-lock",
        "Default": "fa-terminal"
    };
    
    const icon = iconMap[category] || iconMap["Default"];
    
    return `
        <li class="nav-item" role="presentation">
            <button class="nav-link ${isActive ? "active" : ""}" 
                id="${tabId}-tab" 
                data-bs-toggle="pill" 
                data-bs-target="#${tabId}" 
                type="button" 
                role="tab" 
                aria-controls="${tabId}" 
                aria-selected="${isActive}">
                <i class="fas ${icon} me-2"></i>${category}
            </button>
        </li>
    `;
}

// Create tab content
function createTabContent(tabId, category, isActive) {
    const commandsForCategory = commands.filter(command => command.category.includes(category));
    const values = getInputValues();
    const commandList = commandsForCategory.map(command => {
        const commandValues = getCommandValues(command, values);

        return `
            <li class="list-group-item bg-dark text-light"><pre class="command-text mb-0">${renderCommandTemplate(command.command, commandValues)}</pre></li>
        `;
    }).join("");

    return `
        <div class="tab-pane fade ${isActive ? "show active" : ""}" id="${tabId}" role="tabpanel" aria-labelledby="${tabId}-tab">
            <h3>${category}</h3>
            <ul class="list-group" id="${tabId}-commands">
                ${commandList}
            </ul>
        </div>
    `;
}

// Update commands dynamically based on input values
function updateCommands() {
    const values = getInputValues();
    const uniqueCategories = getUniqueCategories();

    uniqueCategories.forEach(category => {
        const categoryCommands = commands.filter(command => command.category.includes(category));
        const updatedCommands = categoryCommands.map(command => {
            const commandValues = getCommandValues(command, values);
            const renderedCommand = renderCommandTemplate(command.command, commandValues);
            
            // Create tags with the new styling
            const tagElements = command.tags.map(tag => 
                `<span class="tag">${escapeHtml(tag)}</span>`
            ).join("");

            return `
                <div class="card mb-3" data-command-id="${escapeHtml(command.id)}">
                    <div class="card-body">
                        <h5 class="card-title">${escapeHtml(command.description)}</h5>
                        <span class="tool-badge">${escapeHtml(command.tool)}</span>
                        <div class="mb-3">
                            ${tagElements}
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <pre class="command-text flex-grow-1 mb-0">${renderedCommand}</pre>
                            <button class="btn btn-secondary btn-sm copy-btn ms-3" type="button">
                                <i class="fas fa-copy me-1"></i>Copy
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        const tabId = formatCategoryToId(category);
        $(`#${tabId}-commands`).html(updatedCommands.join(""));
    });
}

// Get input values from the form
function getInputValues() {
    const values = {};
    inputvariables.forEach(variable => {
        const inputValue = $(`#${variable.id}`).val();
        values[variable.id] = inputValue || variable.default; // Use default if input is empty
    });

    // Add the wordlist value as the wordlist variable
    // values.wordlist = $("#wordlist").val();

    return values;
}

// Replace placeholders in a command template with actual values
function replacePlaceholders(command, values) {
    return commandToString(command).replace(
        /{{([a-zA-Z0-9_]+)}}/g,
        (placeholder, variableId) => {
            if (!Object.prototype.hasOwnProperty.call(values, variableId)) {
                return placeholder;
            }

            return values[variableId] ?? "";
        }
    );
}

// Set up input change listener to update commands dynamically and save to localStorage
function setupInputChangeListener() {
    $("#inputSection").on("input", "input", function () {
        updateCommands();
        saveInputValuesToLocalStorage(); // Save values to localStorage on change
    });
}

function applyLocalValues() {
    inputvariables.forEach(variable => {
        $(`#${variable.id}`).val(localStorage.getItem(variable.id) || variable.default);
    });
    
    // After setting values, update commands
    updateCommands();
}
// Apply default values to input fields
function applyDefaultValues() {
    inputvariables.forEach(variable => {
        $(`#${variable.id}`).val(variable.default);
    });
    
    // After setting values, update commands
    updateCommands();
}

function createEditableVariable(variableId, value) {
    const variable = inputvariables.find(item => item.id === variableId);

    return $("<span>", {
        class: "editable-variable",
        "data-variable-id": variableId,
        tabindex: 0,
        role: "button",
        title: `Click to edit ${variable?.label || variableId}`,
        "aria-label": `Edit ${variable?.label || variableId}`,
        text: value
    });
}

function syncInlineVariableElements(variableId) {
    const values = getInputValues();

    $(".editable-variable").each(function () {
        const variable = $(this);
        if (variable.data("variable-id") !== variableId) {
            return;
        }

        const commandId = variable.closest(".card").data("command-id");
        const command = commands.find(item => item.id === commandId);
        const commandValues = command ? getCommandValues(command, values) : values;
        variable.text(commandValues[variableId] ?? "");
    });
}

function beginInlineVariableEdit(element) {
    const variable = $(element);
    const variableId = variable.data("variable-id");
    const originalValue = variable.text();
    const editor = $("<input>", {
        type: "text",
        class: "inline-variable-input",
        value: originalValue,
        "aria-label": `New value for ${variableId}`
    });
    let editFinished = false;

    const resizeEditor = () => {
        editor.attr("size", Math.max(4, editor.val().length));
    };

    const finishEdit = shouldSave => {
        if (editFinished) {
            return;
        }

        editFinished = true;
        const newValue = shouldSave ? editor.val() : originalValue;
        editor.replaceWith(createEditableVariable(variableId, newValue));

        if (!shouldSave) {
            return;
        }

        $(`#${variableId}`).val(newValue);
        saveInputValuesToLocalStorage();
        syncInlineVariableElements(variableId);
    };

    editor.on("input", resizeEditor);
    editor.on("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEdit(true);
        } else if (event.key === "Escape") {
            event.preventDefault();
            finishEdit(false);
        }
    });
    editor.on("blur", () => finishEdit(true));

    variable.replaceWith(editor);
    resizeEditor();
    editor.trigger("focus").trigger("select");
}

function setupInlineVariableEditing() {
    const commandContainer = $("#pills-tabContent");

    commandContainer.on("click", ".editable-variable", function () {
        beginInlineVariableEdit(this);
    });

    commandContainer.on("keydown", ".editable-variable", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            beginInlineVariableEdit(this);
        }
    });
}

function getCommandTextFromCard(card) {
    const commandText = card.find(".command-text").clone();
    commandText.find(".inline-variable-input").each(function () {
        $(this).replaceWith($(this).val());
    });

    return commandText.text();
}

function setupClipboardButtons() {
    $("#pills-tabContent").on("click", ".copy-btn", function () {
        const button = $(this);
        const commandText = getCommandTextFromCard(button.closest(".card"));

        navigator.clipboard.writeText(commandText)
            .then(() => {
                const originalText = button.html();
                button.removeClass("btn-secondary").addClass("btn-success");
                button.html('<i class="fas fa-check me-1"></i>Copied!');
                
                setTimeout(() => {
                    button.removeClass("btn-success").addClass("btn-secondary");
                    button.html(originalText);
                }, 1000);
            })
            .catch(err => console.error("Failed to copy command:", err));
    });
}

function resetInputValuesToDefault() {
    inputvariables.forEach(variable => $(`#${variable.id}`).val(variable.default));
    updateCommands();
    saveInputValuesToLocalStorage();
}

// bullshit event setup function to expand input field on hover
function setupHoverExpand() {
    $("#inputSection").on({
        mouseenter: function() {
            const input = $(this).find("input");
            const tempSpan = $("<span>")
                .text(input.val())
                .css({
                    "font-family": input.css("font-family"),
                    "font-size": input.css("font-size"),
                    "visibility": "hidden",
                    "white-space": "pre"
                })
                .appendTo("body");
                
            input.css("width", `${tempSpan.width() + 30}px`);
            tempSpan.remove();
        },
        mouseleave: function() {
            $(this).find("input").css("width", "");
        }
    }, ".hover-expand");
}
