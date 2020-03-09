<script runat="server">
Platform.Load("Core", "1");
try {

    //get email address posted through the form - do this for all the required fields
    var email = Request.GetQueryStringParameter("email");  

    //authenticate to get access token
    var authEndpoint = 'https://xxx.auth.marketingcloudapis.com/'  //provide authentication endpoint
    var payload = {
        client_id: "xxx",     //pass client Id
        client_secret: "xxx", //pass client secret
        grant_type: "client_credentials"
    };
    var url = authEndpoint + '/v2/token'
    var contentType = 'application/json'

    var accessTokenRequest = HTTP.Post(url, contentType, Stringify(payload));
    if (accessTokenRequest.StatusCode == 200) {
        var tokenResponse = Platform.Function.ParseJSON(accessTokenRequest.Response[0]);
        var accessToken = tokenResponse.access_token
        var rest_instance_url = tokenResponse.rest_instance_url
    };

    //make api call to fire entry event 
    if (email != null && accessToken != null) {
        var headerNames = ["Authorization"];
        var headerValues = ["Bearer " + accessToken];
        var jsonBody = {
            "ContactKey": email,   //pass contact key value
            "EventDefinitionKey": "xxx",   //provide event api definition key
            "Data": {
                "email": email    //pass all required data for the related data extension
            }
        };

        var requestUrl = rest_instance_url + "/interaction/v1/events";
        var fireEntryEvent = HTTP.Post(requestUrl, contentType, Stringify(jsonBody), headerNames, headerValues);
    };
} catch (error) {
    Write("<br>error: " + Stringify(error));
}
</script>