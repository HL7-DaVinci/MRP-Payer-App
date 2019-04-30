// TODO: Convert dates from UTC to local timezone
// TODO: Limit results to last 24 hours

var list = document.getElementById('list');

function getPatientName (pt) {
    if (pt.name) {
        var names = pt.name.map(function(name) {
            return name.given.join(" ") + " " + name.family;
        });
        return names.join(" / ");
    } else {
        return "anonymous";
    }
}

function displayPatient (pt) {
    document.getElementById('name').innerHTML = getPatientName(pt);
}

FHIR.oauth2.ready(function(smart){
    smart.patient.read().then(function(pt) {
        displayPatient (pt);
    });
    smart.patient.api.fetchAll(
        { type: "Task" }
    ).then(function(reports) {
        reports
            .filter(function(a){
                return a.for.reference === "Patient/" + smart.patient.id;
            }).sort(function(a,b){
                return a.authoredOn < b.authoredOn;
            }).forEach(function(r){
                var date = r.authoredOn.split('T');
                if (date.length > 1) date = date[0] + " " + date[1].split('.')[0];
                var id = r.id;
                var type = "Post-discharge";
                if (r.code.coding[0].code !== "1111F") type = "Other";
                list.innerHTML +=  "<tr><td>" + date + "</td><td>" + id + "</td><td>" + type +  "</td></tr>";
            });
        $('#loader').hide();   
        $('#review-screen').show();
    });
});