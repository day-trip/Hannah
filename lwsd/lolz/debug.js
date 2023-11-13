
attr: primaryButtonAttributes,
    externalCss: {
    'button': true,
        'primary': true },
value: primaryButtonText() || str['CT_PWD_STR_SignIn_Button_Next'],
    hasFocus: focusOnPrimaryButton,
    click: svr.fEnableLivePreview ?  function() { } : primaryButton_onClick,
    clickBubble: !svr.fEnableLivePreview,
    enable: isPrimaryButtonEnabled,
    visible: isPrimaryButtonVisible,
    preventTabbing: primaryButtonPreventTabbing