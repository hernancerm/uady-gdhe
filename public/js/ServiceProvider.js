class ServicesProvider{

    logInWithCredentials(data, callback, error) {
        $.ajax({
            url: '../src/services/READ_admin_BY_credentials.php',
            method: 'POST',
            data: JSON.stringify(data),
            success: callback,
            error: error
        });
    }

}