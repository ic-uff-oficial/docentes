// Load professors from JSON file and display them with checkboxes
fetch('professors.json')
    .then(response => response.json())
    .then(data => {
        const professorsList = document.getElementById('professors-list');
        
        data.professors.forEach(professor => {
            const professorDiv = document.createElement('div');
            professorDiv.className = 'professor-item';

            const professorName = document.createElement('label');
            professorName.textContent = professor.name;
            professorDiv.appendChild(professorName);

            const checkboxGroup = document.createElement('div');
            checkboxGroup.className = 'checkbox-group';

            ['Present', 'Absent', 'Justified'].forEach(status => {
                const checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = status;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `${professor.name}-${status.toLowerCase()}`;

                checkboxLabel.appendChild(checkbox);
                checkboxGroup.appendChild(checkboxLabel);
            });

            professorDiv.appendChild(checkboxGroup);
            professorsList.appendChild(professorDiv);
        });
    })
    .catch(error => console.error('Error loading professors:', error));

// Handle form submission
document.getElementById('attendance-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const presentProfessors = [];
    const absentProfessors = [];
    const justifiedProfessors = [];

    const checkboxes = document.querySelectorAll('#professors-list input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const [professorName, status] = checkbox.name.split('-');
            if (status === 'present') {
                presentProfessors.push(professorName);
            } else if (status === 'absent') {
                absentProfessors.push(professorName);
            } else if (status === 'justified') {
                justifiedProfessors.push(professorName);
            }
        }
    });

    const reportText = `
Present professors: ${presentProfessors.join(', ')}
Absent professors: ${absentProfessors.join(', ')}
Justified professors: ${justifiedProfessors.join(', ')}
    `.trim();

    document.getElementById('attendance-report').value = reportText;
});