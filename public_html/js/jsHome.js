var token = "90932533|-31949277339731359|90949206";
var iml = "/api/iml";
var irl = "/api/irl";
var dbURL = "http://api.login2explore.com:5577";
var dbName = "projectmanagement";
var relationName = "projects";


function enableAllFields()
{
    $("#save").prop('disabled', false);
    $("#reset").prop('disabled', false);
    $("#update").prop('disabled', false);
    $("#reset").prop('disabled', false);
    $("#project-name").prop('disabled', false);
    $("#deadline").prop('disabled', false);
    $("#assignment-date").prop('disabled', false);
    $("#assigned-to").prop('disabled', false);
}

function initializeForm()
{


    $("#project-id").focus();
    $("#save").prop('disabled', true);
    $("#reset").prop('disabled', true);
    $("#update").prop('disabled', true);
    $("#reset").prop('disabled', true);
    $("#project-name").prop('disabled', true);
    $("#deadline").prop('disabled', true);
    $("#assignment-date").prop('disabled', true);
    $("#assigned-to").prop('disabled', true);
}
initializeForm();

function validateAndGetFormData()
{

    $("#empId").val("");
    $("#empName").val("");
    $("#empEmail").val("");
    $("#empId").focus();
}

function validateAndGetFormData() {

    var projectId = $("#project-id").val();
    if (projectId === "") {
        alert("Project ID Required Value");
        $("#project-id").focus();
        return "";
    }
    var projectName = $("#project-name").val();
    if (projectName === "") {
        alert("Project Name is Required Value");
        $("#project-name").focus();
        return "";
    }
    var assignedTo = $("#assigned-to").val();
    if (assignedTo === "") {
        alert("Assigned To is Required Value");
        $("#assigned-to").focus();
        return "";
    }
    var assignmentDate = $("#assignment-date").val();
    if (assignmentDate === "") {
        alert("Assignment Date is Required Value");
        $("#assignment-date").focus();
        return "";
    }
    var deadline = $("#deadline").val();
    if (deadline === "") {
        alert("Deadline is Required Value");
        $("#deadline").focus();
        return "";
    }
    var jsonStrObj = {
        projectId: projectId,
        projectName: projectName,
        assignedTo: assignedTo,
        assignmentDate: assignmentDate,
        deadline: deadline,

    };
    return JSON.stringify(jsonStrObj);
}

function resetForm()
{
    $("#project-id").val("");
    $("#project-name").val("");
    $("#assigned-to").val("");
    $("#assignment-date").val("");
    $("#deadline").val("");
    $("#project-id").focus();
}
function handleSave()
{



    var jsonStr = validateAndGetFormData(); // will validate form data
    if (jsonStr === "") {
        return;
    }

    var putReqStr = createPUTRequest(token,
            jsonStr, dbName, relationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommand(putReqStr,
            iml);

    jQuery.ajaxSetup({async: true});

    resetForm();
    alert("Data successfully saved");
    initializeForm();
}

function handleUpdate()
{

    var jsonStr = validateAndGetFormData(); // will validate form data
    if (jsonStr === "") {
        return;
    }

    var updateReqStr = createUPDATERecordRequest(token, jsonStr, dbName, relationName, localStorage.getItem("rec_no"));


    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommand(updateReqStr, iml
            );

    jQuery.ajaxSetup({async: true});

    alert("Data Successfully Updated");
    resetForm();
    initializeForm();
    $("#project-id").prop('disabled', false);


}

function handleReset()
{

    resetForm();
    initializeForm();
    $("#project-id").prop('disabled', false);


}


function projectIdAsJsonObj()
{
    var projectId = $("#project-id").val();

    var jsonStr = {
        projectId: projectId
    };

    return JSON.stringify(jsonStr);
}

function getProjectDetails()
{
    var getProjectIdAsJsonObj = projectIdAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(token, dbName, relationName, getProjectIdAsJsonObj);
    jQuery.ajaxSetup({async: false});


    var resultObj = executeCommand(getRequest, irl);
    jQuery.ajaxSetup({async: true});
    if (resultObj.status === 400)
    {
        enableAllFields();
        $("#update").prop('disabled', true);
        $("#project-name").focus();

    } else if (resultObj.status === 200)
    {
        enableAllFields();
        $("#project-id").prop('disabled', true);
        filldata(resultObj);

        $("#update").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#save").prop('disabled', true);
        $("#project-name").focus();
    }
}


function saveProjectDetails(resultObj)
{
    var projectData = JSON.parse(resultObj.data);

    localStorage.setItem("rec_no", projectData.rec_no);
}
function filldata(resultObj)
{
    saveProjectDetails(resultObj);
    var details = JSON.parse(resultObj.data).record;
    console.log(details.projectName);
    $("#project-name").val(details.projectName);

    $("#assigned-to").val(details.assignedTo);

    $("#assignment-date").val(details.assignmentDate);

    $("#deadline").val(details.deadline);


}