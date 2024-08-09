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

            ['Present', 'Vacation', 'Justified'].forEach(status => {
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
    const vacationProfessors = [];
    const justifiedProfessors = [];

    const allProfessors = [];

    const checkboxes = document.querySelectorAll('#professors-list input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        const [professorName, status] = checkbox.name.split('-');

        if (!allProfessors.includes(professorName)) {
            allProfessors.push(professorName);
        }

        if (checkbox.checked) {
            if (status === 'present') {
                presentProfessors.push(professorName);
            } else if (status === 'vacation') {
                vacationProfessors.push(professorName);
            } else if (status === 'justified') {
                justifiedProfessors.push(professorName);
            }
        }
    });

    // Merge vacation and justified professors without repetition
    const finalJustifiedProfessors = Array.from(new Set([...justifiedProfessors, ...vacationProfessors]));

    // Find absent professors: those who are not in present or justified lists
    const absentProfessors = allProfessors.filter(professor => 
        !presentProfessors.includes(professor) && !finalJustifiedProfessors.includes(professor)
    );

    const reportText = `
Present professors: ${presentProfessors.join(', ')}
Vacation professors: ${vacationProfessors.join(', ')}
Justified professors: ${finalJustifiedProfessors.join(', ')}
Absent professors: ${absentProfessors.join(', ')}
    `.trim();

    document.getElementById('attendance-report').value = reportText;
});
