const maxRows = 20;
const minRows = 1;

var seekSequence = [];
var seekTime = 0;
var headPosition;
var diskSize = 0;

function addRow() {
  var table = document.getElementById("req-seq");
  var count = table.rows.length;
  if (count == minRows+1) {
    var removeBtn = document.getElementById("remove");
    removeBtn.disabled = false;
  }
  if (count == maxRows) {
    var addBtn = document.getElementById("add");
    addBtn.disabled = true;
  }
  if (count < minRows+1 || count > maxRows) return;
  var row = table.insertRow(count);
  var th = document.createElement("th");
  th.innerHTML = count;
  th.scope = "row";
  var td = document.createElement("td");
  var input = document.createElement("input");
  input.type = "text";
  input.id = "req-seq" + count;
  td.appendChild(input);
  row.appendChild(th);
  row.appendChild(td);
}

function removeRow() {
  var table = document.getElementById("req-seq");
  var count = table.rows.length;
  count--;
  if (count == maxRows) {
    var addBtn = document.getElementById("add");
    addBtn.disabled = false;
  }
  if (count == minRows+1) {
    var removeBtn = document.getElementById("remove");
    removeBtn.disabled = true;
  }
  if (count < minRows+1 || count > maxRows) return;
  table.deleteRow(count);
}

function clook() {
  var headPos = 0;
  headPos = document.getElementById("head-pos").value;
  diskSize = document.getElementById("disk-size").value;
  headPos = parseInt(headPos);
  headPosition = headPos;
  diskSize = parseInt(diskSize);
  if (!Number.isInteger(headPos) || !Number.isInteger(diskSize)) {
    alert('Please enter an Integer in Disk Size and Head Position.');
    return false;
  }
  if (headPos < 0 || diskSize < 0) {
    alert('Invalid Input, Disk Size or Head Position should not be negative.');
    return false;
  }
  if (headPos > diskSize) {
    alert('Invalid Head Position. Head Position should be less than or equal to Disk Size.');
    return false;
  }
  var direction = document.getElementById("Right").checked;
  var arr = takeInput();
  if (arr === undefined) return false;
  var answer = clookScheduling(arr, headPos, direction);
  var result = document.getElementById("result");
  var seekCnt = document.createElement("p");
  seekCnt.innerHTML = "Total Seek Count: " + answer.seekCount;
  var seekSq = document.createElement("p");
  seekSq.innerHTML = "Seek Sequence: " + answer.seekSeq;
  result.innerHTML = "";
  result.appendChild(seekCnt);
  result.appendChild(seekSq);
  seekSequence = answer.seekSeq;
  seekTime = answer.seekCount;
}

function takeInput() {
  var table = document.getElementById("req-seq");
  var count = table.rows.length;
  var arr = [];
  for (let i=1; i<count; i++) {
    var inpId = "req-seq" + i;
    arr[i] = document.getElementById(inpId).value;
    let num = parseInt(arr[i]);
    if (!Number.isInteger(num)) {
      alert("Please enter Integer value in #" + i + " textbox of Request Position Column.");
      return undefined;
    }
    if (num > diskSize || num < 0) {
      alert('Invalid Request Position at #' + i + '.');
      return undefined;
    }
  }
  return arr;
}

function clookScheduling(arr, headPos, direction) {
  var seekCount = 0;
  var left=[], right=[], seekSeq=[];
  for (let i=0; i<arr.length; i++) {
    if (arr[i] < headPos) {
      left.push(arr[i]);
    } else if (arr[i] > headPos) {
      right.push(arr[i]);
    }
  }
  left.sort(function(a, b){return a - b});
  right.sort(function(a, b){return a - b});
  if (direction == true) {
    seekCount += right[0] - headPos;
    for (let i=0; i<right.length; i++) {
      seekSeq.push(right[i]);
      if (i != right.length-1) {
        seekCount += right[i+1] - right[i];
      }
    }
    seekCount += right[right.length-1] - left[0];
    for (let i=0; i<left.length; i++) {
      seekSeq.push(left[i]);
      if (i != left.length-1) {
        seekCount += left[i+1] - left[i];
      }
    }
  } else {
    seekCount += headPos - left[left.length - 1];
    for (let i=left.length-1; i>=0; i--) {
      seekSeq.push([left[i]]);
      if (i != 0) {
        seekCount += left[i] - left[i-1];
      }
    }
    seekCount += right[right.length-1] - left[0];
    for (let i=right.length-1; i>=0; i--) {
      seekSeq.push(right[i]);
      if (i != 0) {
        seekCount += right[i] - right[i-1];
      }
    }
  }
  return {seekCount, seekSeq};
}
