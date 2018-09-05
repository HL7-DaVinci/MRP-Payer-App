// TODO: Convert dates from UTC to local timezone

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
        { type: "MeasureReport" }
    ).then(function(reports) {
        var promise = Promise.resolve();
        reports
            .sort(function(a,b){
                return a.date < b.date;
            }).filter(function(a){
                  return a.id !== "measure-mrp" && a.date >= "2018-09-01T03:04:39.000+00:00" && a.patient.reference === "Patient/" + smart.patient.id;
            }).forEach(function(r){
                var date = r.date.split('T');
                if (date.length > 1) date = date[0] + " " + date[1].split('.')[0];
                var taskID = r.evaluatedResources.extension
                              .find(e => e.url==='http://hl7.org/fhir/ig/davinci/StructureDefinition/extension-referenceAny')
                              .valueReference.reference.split("/")[1];
                promise.then(function () {
                    return smart.api.read({type: "Task", id: taskID});
                }).then(function(t){
                    var id = t.data.id;
                    var type = "Post-discharge";
                    if (t.data.code.coding[0].code !== "1111F") type = "Other";
                    list.innerHTML +=  "<tr><td>" + date + "</td><td>" + id + "</td><td>" + type +  "</td></tr>";
                    return smart.api.read({type: "Practitioner", id: t.data.owner.reference.split("/")[1]});
                //}).then(function(p){
                //    console.log(p.data);
                //    var name = getPatientName(p.data);
                    
                });
            });
        promise.then(function(){
            $('#loader').hide();   
            $('#review-screen').show();
        });
    });
});