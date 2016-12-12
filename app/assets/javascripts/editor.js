(function() {
    var pens = {};

    Array.prototype.forEach.call(document.querySelectorAll('.textarea'), function(editor) {
        var event= editor.dataset.editOn;
        if (event == 'load') {
            startEditing(editor);
        } else {
            editor.addEventListener(event, function() {
                if (editor.getAttribute('contenteditable') !== 'true') {
                    startEditing(editor);
                    // for content editable, we need to refocus to show the caret
                    editor.blur(); 
                    editor.focus();
                }
            });
        }
    });

    function startEditing(editor) {
        var name = editor.dataset.name;
        pens[name] = new Pen({
            editor: editor,
            class: 'pen',
            textarea: '<textarea name="' + name + '"></textarea>',
            list: ['p', 'h1', 'h2', 'blockquote', 'insertorderedlist', 'insertunorderedlist', 'bold', 'italic', 'underline', 'strikethrough', 'createlink', 'insertimage'],
            title: {
                'p': 'Paragraph',
                'h1': 'Major Heading',
                'h2': 'Minor Heading',
                'blockquote': 'Quotation',
                'insertorderedlist': 'Ordered List',
                'insertunorderedlist': 'Unordered List',
                'bold': 'Bold',
                'italic': 'Italic',
                'underline': 'Underline',
                'strikethrough': 'Strikethrough',
                'createlink': 'Link',
                'insertimage': 'Image'
            }
        });
        return pens[name];
    }

    Array.prototype.forEach.call(document.querySelectorAll('form'), function(form) {
        var shouldAllowAlert = false;
        form.addEventListener('submit', function() {
            if (shouldAllowAlert) {
                return;
            }
            Array.prototype.forEach.call(document.querySelectorAll('.textarea'), function(editor) {
                var name = editor.dataset.name;
                var textarea = document.querySelector('textarea[name="' + name + '"]');
                if (!textarea) {
                    textarea = document.createElement('textarea');
                    textarea.name = name;
                    textarea.style.display = 'none';
                    form.appendChild(textarea);
                }
                textarea.value = editor.innerHTML;
                if (pens[name]) {
                    pens[name].destroy();
                }
            });
        }, false);
        Array.prototype.forEach.call(form.querySelectorAll('button'), function(button) {
            form.addEventListener('click', function(event) {
                shouldAllowAlert = (event.target.value === 'cancel');
            });
        });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.check-box-field .other input'), function(input) {
        var checkbox = document.getElementById(input.parentElement.parentElement.attributes.for.value);
        input.addEventListener('keyup', function(event) {
            if (event.target.value) {
                checkbox.checked = true;
            }
        });
        input.addEventListener('click', function(event) {
            checkbox.checked = true;
        });
        var setRequired = function() {
            if (checkbox.checked) {
                input.setAttribute('required',  'required');
            } else {
                input.removeAttribute('required');
            }
        };
        Array.prototype.forEach.call(document.querySelectorAll('.check-box-field input'), function(_input) {
            _input.addEventListener('change', function(event) { setRequired(); });
        });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-toggles]'), function(checkbox) {
        var toggles = document.getElementById(checkbox.dataset.toggles);
        toggles.classList.add('toggleable');
        var form = checkbox.parentNode;
        while (form && form.nodeName != 'FORM') {
            form = form.parentNode;
        }
        var toggle = function() {
            toggles.classList[checkbox.checked ? 'add' : 'remove']('open');
            if (form) {
                if (checkbox.checked) {
                    form.removeAttribute('novalidate');
                } else {
                    form.setAttribute('novalidate', 'novalidate');
                }
            }
        };
        toggle();
        checkbox.addEventListener('change', function(event) { toggle(); });
    });

    Array.prototype.forEach.call(document.querySelectorAll('fieldset.translator'), function(translator) {
        Array.prototype.forEach.call(translator.querySelectorAll('.locale-select a'), function(selector) {
            selector.addEventListener('click', function(event) {
                event.preventDefault();
                var locale = event.target.parentElement.getAttribute('data-locale');
                Array.prototype.forEach.call(translator.querySelectorAll('.locale-select li'), function(_selector) {
                    _selector.className = _selector.getAttribute('data-locale') == locale ? 'selected' : '';
                });
                Array.prototype.forEach.call(translator.querySelectorAll('.text-editors li'), function(editor) {
                    editor.className = editor.getAttribute('data-locale') == locale ? 'selected' : '';
                });
            });
        });
    });
})();
