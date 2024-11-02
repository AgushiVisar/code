let processes = [];

function addProcess() {
    const processId = document.getElementById("processId").value;
    const burstTime = parseInt(document.getElementById("burstTime").value);
    const priority = parseInt(document.getElementById("priority").value);
    
    if (processId && burstTime >= 0 && priority > 0) {
        processes.push({ id: processId, burstTime, priority });
        updateProcessTable();
        document.getElementById("processId").value = '';
        document.getElementById("burstTime").value = '';
        document.getElementById("priority").value = '';
    } else {
        alert("Please enter valid process details.");
    }
}

function updateProcessTable() {
    const table = document.getElementById("processTable");
    table.innerHTML = `
        <tr>
            <th>Process ID</th>
            <th>Burst Time (ms)</th>
            <th>Arrival Time (ms)</th>
        </tr>
    `;

    processes.forEach(process => {
        const row = table.insertRow();
        row.insertCell(0).innerText = process.id;
        row.insertCell(1).innerText = process.burstTime;
        row.insertCell(2).innerText = process.priority;
    });
}

function calculateFCFS() {
    if (processes.length === 0) {
        alert("No processes to schedule.");
        return;
    }

    let waitingTime = 0;
    let totalWaitingTime = 0;
    const resultTable = document.getElementById("resultTable");
    resultTable.innerHTML = `
        <tr>
            <th>Process ID</th>
            <th>Burst Duration</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
        </tr>
    `;

    const waitingTimes = [];

    processes.forEach(process => {
        const turnaroundTime = waitingTime + process.burstTime;
        waitingTimes.push(waitingTime);
        totalWaitingTime += waitingTime;

        const row = resultTable.insertRow();
        row.insertCell(0).innerText = process.id;
        row.insertCell(1).innerText = process.burstTime;
        row.insertCell(2).innerText = waitingTime;
        row.insertCell(3).innerText = turnaroundTime;

        waitingTime += process.burstTime;
    });

    const averageWaitingTime = totalWaitingTime / processes.length;
    const waitingTimeSum = waitingTimes.join(' + ');

    document.getElementById("average-waiting-time").innerText = `AWT = (${waitingTimeSum}) / ${processes.length} = ${averageWaitingTime.toFixed(2)} ms`;
    
    document.getElementById("detailed-calculation").innerHTML = `
        <p>Calculation Breakdown:</p>
        <p>Total Waiting Time: ${totalWaitingTime} ms</p>
        <p>Number of Processes: ${processes.length}</p>
        <p>AWT = (${waitingTimeSum}) / ${processes.length} = ${averageWaitingTime.toFixed(2)} ms</p>
    `;

    drawGanttChart('FCFS');
}

function calculatePriority() {
    if (processes.length === 0) {
        alert("No processes to schedule.");
        return;
    }

    const sortedProcesses = [...processes].sort((a, b) => a.priority - b.priority);

    let waitingTime = 0;
    let totalWaitingTime = 0;
    const resultTable = document.getElementById("resultTable");
    resultTable.innerHTML = `
        <tr>
            <th>Process ID</th>
            <th>Burst Duration</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
        </tr>
    `;

    const waitingTimes = [];

    sortedProcesses.forEach(process => {
        const turnaroundTime = waitingTime + process.burstTime;
        waitingTimes.push(waitingTime);
        totalWaitingTime += waitingTime;

        const row = resultTable.insertRow();
        row.insertCell(0).innerText = process.id;
        row.insertCell(1).innerText = process.burstTime;
        row.insertCell(2).innerText = waitingTime;
        row.insertCell(3).innerText = turnaroundTime;

        waitingTime += process.burstTime;
    });

    const averageWaitingTime = totalWaitingTime / sortedProcesses.length;
    const waitingTimeSum = waitingTimes.join(' + ');

    document.getElementById("average-waiting-time").innerText = `AWT = (${waitingTimeSum}) / ${sortedProcesses.length} = ${averageWaitingTime.toFixed(2)} ms`;
    
    document.getElementById("detailed-calculation").innerHTML = `
        <p>Calculation Breakdown:</p>
        <p>Total Waiting Time: ${totalWaitingTime} ms</p>
        <p>Number of Processes: ${sortedProcesses.length}</p>
        <p>AWT = (${waitingTimeSum}) / ${sortedProcesses.length} = ${averageWaitingTime.toFixed(2)} ms</p>
    `;

    drawGanttChart('Priority', sortedProcesses);
}

function drawGanttChart(type, sortedProcesses = processes) {
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = "";

    let currentTime = 0;

    sortedProcesses.forEach(process => {
        const processContainer = document.createElement("div");
        processContainer.className = "gantt-process";
        processContainer.style.display = "inline-block";
        processContainer.style.textAlign = "center";
        processContainer.style.width = process.burstTime * 20 + "px";
        processContainer.style.backgroundColor = "#4CAF50";
        processContainer.style.border = "1px solid black";
        processContainer.style.padding = "5px";
        processContainer.style.position = "relative";
        processContainer.style.marginRight = "30px";
        processContainer.style.height = "20px";

        const processLabel = document.createElement("div");
        processLabel.innerText = process.id;
        processLabel.style.fontWeight = "bold";
        processLabel.style.position = "absolute";
        processLabel.style.top = "50%";
        processLabel.style.left = "50%";
        processLabel.style.transform = "translate(-50%, -50%)";

        const startTimeLabel = document.createElement("span");
        startTimeLabel.innerText = currentTime;
        startTimeLabel.style.position = "absolute";
        startTimeLabel.style.left = "-10px";
        startTimeLabel.style.top = "100%";
        startTimeLabel.style.fontSize = "12px";

        const endTimeLabel = document.createElement("span");
        endTimeLabel.innerText = currentTime + process.burstTime;
        endTimeLabel.style.position = "absolute";
        endTimeLabel.style.right = "-10px";
        endTimeLabel.style.top = "100%";
        endTimeLabel.style.fontSize = "12px";

        processContainer.appendChild(processLabel);
        processContainer.appendChild(startTimeLabel);
        processContainer.appendChild(endTimeLabel);
        ganttChart.appendChild(processContainer);

        currentTime += process.burstTime;
    });

    const timeLabel = document.createElement("div");
    timeLabel.innerText = `Total Time: ${currentTime} ms`;
    timeLabel.style.marginTop = "10px";
    ganttChart.appendChild(timeLabel);
}
