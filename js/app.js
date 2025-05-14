// Commands array
const commands = [
    // **** WEB DISCOVERY COMMANDS ****
    { // fuff dir discovery
        id: "fuff_dir_discovery",
        description: "Directory discovery using ffuf",
        command: "ffuf -w {{wordlist}} -u http://{{target_ip}}/FUZZ",
        tool: "ffuf",
        category: "Web Discovery",
        tags: ["brute force", "web"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt"
    },
    // gobuster dir discovery
    {
        id: "gobuster_dir_discovery",
        description: "Directory discovery using gobuster",
        command: "gobuster dir -u http://{{target_ip}} -w {{wordlist}}",
        tool: "gobuster",
        category: "Web Discovery",
        tags: ["brute force", "web"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt"
    },
    // ffuf subdomain discovery
    {
        id: "fuff_subdomain_discovery",
        description: "Subdomain discovery using ffuf",
        command: "ffuf -w {{wordlist}} -u http://{{target_domain}} -H \"Host: FUZZ.{{target_domain}}\" -fs 4242",
        tool: "ffuf",
        category: "DNS And VHOST Discovery",
        tags: ["subdomain discovery", "dns"],
        default_wordlist: "/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt"
    },
    // ffuf vhost discovery
    {
        id: "ffuf_vhost_discovery",
        description: "Virtual host discovery (without DNS records)",
        command: "ffuf -w {{wordlist}} -u http://{{target_ip}} -H \"Host: FUZZ\" -fs 4242",
        tool: "ffuf",
        category: "DNS And VHOST Discovery",
        tags: ["vhost discovery", "dns"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/vhost-wordlist.txt"
    },
    // gobuster vhost discovery
    {
        id: "gobuster_vhost_discovery",
        description: "Virtual host discovery using gobuster",
        command: "gobuster vhost -u http://{{target_ip}} -w {{wordlist}}",
        tool: "gobuster",
        category: "DNS And VHOST Discovery",
        tags: ["vhost discovery", "dns"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/vhost-wordlist.txt"
    },
    // gobuster subdomain discovery
    {
        id: "gobuster_subdomain_discovery",
        description: "Subdomain discovery using gobuster",
        command: "gobuster dns -d {{target_domain}} -w {{wordlist}}",
        tool: "gobuster",
        category: "DNS And VHOST Discovery",
        tags: ["subdomain discovery", "dns"],
        default_wordlist: "/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt"
    },
    // **** WEB SCANNING COMMANDS ****
    {
        id: "get_param_fuzz",
        description: "GET param fuzzing, filtering for invalid response size",
        command: "ffuf -w {{wordlist}} -u http://{{target_ip}}/index.php?FUZZ=test_value -fs 4242",
        tool: "ffuf",
        category: "Parameter fuzzing",
        tags: ["get param", "response filtering"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/param-names.txt"
    },
    {
        id: "get_param_values",
        description: "GET parameter fuzzing if the param is known (fuzzing values) and filtering 401",
        command: "ffuf -w {{wordlist}} -u http://{{target_ip}}/script.php?valid_name=FUZZ -fc 401",
        tool: "ffuf",
        category: "Parameter fuzzing",
        tags: ["get param", "filter 401"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/param-values.txt"
    },
    {
        id: "post_param_fuzz",
        description: "POST parameter fuzzing with filtering for status code 401",
        command: "ffuf -w {{wordlist}} -X POST -d \"username=admin\\&password=FUZZ\" -u http://{{target_ip}}/login.php -fc 401",
        tool: "ffuf",
        category: ["Authentication", "Parameter fuzzing"],
        tags: ["post param", "filter 401"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/post-data.txt"
    },
    {
        id: "post_json_fuzz",
        description: "Fuzz POST JSON data. Match all responses not containing text 'error'.",
        command: `ffuf -w {{wordlist}} -u http://{{target_ip}}/ -X POST -H "Content-Type: application/json" -d '{"name": "FUZZ", "anotherkey": "anothervalue"}' -fr "error"`,
        tool: "ffuf",
        category: "JSON fuzzing",
        tags: ["post","json", "response filtering"],
        default_wordlist: "/usr/share/seclists/Discovery/Web-Content/json-entries.txt"
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
        default_wordlist: "/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt"
    },
    /// *** SSH AUTHENTICATION COMMANDS ***
    {
        id: "hydra_ssh_auth",
        description: "Brute force SSH authentication using Hydra",
        command: "hydra -l {{target_user}} -P {{wordlist}} {{target_ip}} ssh",
        tool: "hydra",
        category: "Authentication",
        tags: ["brute force", "ssh"],
        default_wordlist: "/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt"
    },
    // ftp brute force
    {
        id: "hydra_ftp_auth",
        description: "Brute force FTP authentication using Hydra",
        command: "hydra -l {{target_user}} -P {{wordlist}} {{target_ip}} ftp",
        tool: "hydra",
        category: "Authentication",
        tags: ["ftp"],
        default_wordlist: "/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt"
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
        command: "for d in `find /var /etc /home /root /tmp /usr /opt /boot /sys -type d -user $(whoami) 2>/dev/null`; do find $d ! -user `whoami` -exec ls -l {} \; 2>/dev/null; done",
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
];
// 

// Wordlist paths
const wordlistPaths = [
    // web content
    "/usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt",
    "/usr/share/seclists/Discovery/Web-Content/raft-large-files.txt",
    // Passwords
    "/usr/share/wordlists/rockyou.txt",
    // Usernames
    "/usr/share/seclists/Usernames/xato-net-10-million-usernames.txt",
    "/usr/share/seclists/Usernames/Names/names.txt",
    // subdomains
    "/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
    "/usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt",
];

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
    const commandList = commandsForCategory.map(command => `
        <li class="list-group-item bg-dark text-light">${command.command}</li>
    `).join("");

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
            const wordlist = values.wordlist || command.default_wordlist;
            const replacedCommand = replacePlaceholders(command.command, { ...values, wordlist });
            
            // Create tags with the new styling
            const tagElements = command.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join("");

            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${command.description}</h5>
                        <span class="tool-badge">${command.tool}</span>
                        <div class="mb-3">
                            ${tagElements}
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <pre class="command-text flex-grow-1">${replacedCommand}</pre>
                            <button class="btn btn-secondary btn-sm copy-btn ms-3" data-command="${btoa(replacedCommand)}">
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

    setupClipboardButtons();
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
    return Object.entries(values).reduce((cmd, [key, value]) => 
        cmd.replace(new RegExp(`{{${key}}}`, "g"), value || ""),
    command);
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

function setupClipboardButtons() {
    $(".copy-btn").on("click", function () {
        const button = $(this);
        navigator.clipboard.writeText(atob(button.data("command")))
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
