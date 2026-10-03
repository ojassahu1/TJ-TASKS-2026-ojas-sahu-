const OS_MODULES = {
  status: {
    title: "SYSTEM_STATUS",
    render: () => `
      <div class="terminal-block">
        <span class="text-bright font-bold">SYSTEM STATUS</span>
        <br><br>
        CPU             [████████░░] 78%
        <br>MEMORY          [██████░░░░] 61%
        <br>NETWORK         [██████████] ONLINE
        <br>UPTIME          04:27:19
        <br>SYSTEM          MATRIX_OS
        <br>STATUS          OPERATIONAL
      </div>
    `
  },
  operator: {
    title: "OPERATOR_PROFILE",
    render: () => `
      <div class="terminal-block">
        <span class="text-bright font-bold">OPERATOR PROFILE</span>
        <br><br>
        OPERATOR<br>
        OJAS SAHU<br><br>
        ROLE<br>
        DEVELOPER / BUILDER<br><br>
        STATUS<br>
        ONLINE
      </div>
    `
  },
  tech_stack: {
    title: "TECH_STACK",
    render: () => `
      <div class="terminal-block">
        <span class="text-bright font-bold">TECH_STACK</span>
        <br><br>
        FRONTEND<br>
        > HTML, CSS, JAVASCRIPT<br><br>
        BACKEND<br>
        > NODE.JS<br><br>
        TOOLS<br>
        > GIT, GITHUB
      </div>
    `
  }
};
