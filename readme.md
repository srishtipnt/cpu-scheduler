# Intelligent CPU Scheduler Simulator

## Project Overview  
The Intelligent CPU Scheduler Simulator is a web-based tool that allows users to simulate and analyze different CPU scheduling algorithms with real-time visualizations. This project supports:  

- First-Come, First-Served (FCFS)  
- Shortest Job First (SJF)  
- Priority Scheduling  
- Round Robin (RR)  

Users can input process details (Arrival Time, Burst Time, and Priority) and visualize execution through Gantt charts and performance metrics like Average Waiting Time (AWT) and Turnaround Time (TAT).  

---

## Features  
- Process Input Form – Users can enter process details dynamically.  
- Multiple Scheduling Algorithms – Compare different scheduling techniques.  
- Gantt Chart Visualization – View real-time execution order.  
- Performance Metrics – Calculate AWT, TAT, and Throughput.  
- Algorithm Comparison Mode – Compare multiple algorithms side by side.  
- Interactive UI – Built with React.js for a smooth user experience.  

---

## Technology Stack  

### Frontend  
- React.js – UI development  
- @nivo/bar – Performance metric visualizations  
- @visx (scale, group, shape, axis, text) – Gantt Chart visualization  

### Backend  
- Node.js & Express.js – API handling  
- MongoDB – Database (if required for storing process data)  



 Here is the **Getting Started** section formatted properly in Markdown with code blocks:  


## Getting Started  

### 1. Clone the Repository  
```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies  

#### Frontend (React)  
```sh
cd client
npm install
```

#### Backend (Node.js + Express)  
```sh
cd server
npm install
```

### 3. Run the Application  

#### Start Backend Server  
```sh
cd backend
npm start
```

#### Start Frontend  
```sh
cd client
npm start
```

The application will be available at **http://localhost:5173**
```

