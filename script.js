document.addEventListener('DOMContentLoaded', function () {
    const membersList = document.getElementById('members');
    const addMemberBtn = document.getElementById('add-member-btn');
    const newMemberNameInput = document.getElementById('new-member-name');
    const searchInput = document.getElementById('search-input');
    const memberCounter = document.getElementById('total-members');
  
    let memberCount = localStorage.getItem('memberCount') ? parseInt(localStorage.getItem('memberCount')) : 0;
  
    function updateMemberCounter() {
      memberCounter.textContent = memberCount;
    }
  
    function renderMembers() {
      membersList.innerHTML = '';
      for (let i = 1; i <= memberCount; i++) {
        const memberName = localStorage.getItem(`member${i}`);
        if (memberName.toLowerCase().includes(searchInput.value.trim().toLowerCase())) {
          const li = document.createElement('li');
          li.textContent = memberName;
  
          const paymentStatus = localStorage.getItem(`paymentStatus_${i}`) || 'pendiente'; // Estado de pago predeterminado: pendiente
          const lastPaymentDate = localStorage.getItem(`lastPaymentDate_${i}`) || 'Nunca'; // Fecha de pago predeterminada: Nunca
          
          const paymentRadioPaid = document.createElement('input');
          paymentRadioPaid.type = 'radio';
          paymentRadioPaid.name = `payment_${i}`;
          paymentRadioPaid.value = 'pagado';
          paymentRadioPaid.checked = (paymentStatus === 'pagado');
          paymentRadioPaid.addEventListener('change', function() {
            localStorage.setItem(`paymentStatus_${i}`, this.value);
            localStorage.setItem(`lastPaymentDate_${i}`, getCurrentDate());
            renderMembers();
          });
          
          const paymentRadioPending = document.createElement('input');
          paymentRadioPending.type = 'radio';
          paymentRadioPending.name = `payment_${i}`;
          paymentRadioPending.value = 'pendiente';
          paymentRadioPending.checked = (paymentStatus === 'pendiente');
          paymentRadioPending.addEventListener('change', function() {
            localStorage.setItem(`paymentStatus_${i}`, this.value);
            localStorage.setItem(`lastPaymentDate_${i}`, '');
            renderMembers();
          });
  
          const labelPaid = document.createElement('label');
          labelPaid.textContent = 'Pagado';
          labelPaid.appendChild(paymentRadioPaid);
          
          const labelPending = document.createElement('label');
          labelPending.textContent = 'Pendiente';
          labelPending.appendChild(paymentRadioPending);
  
          li.appendChild(labelPaid);
          li.appendChild(labelPending);
  
          const lastPaymentLabel = document.createElement('span');
          lastPaymentLabel.textContent = ` Último pago: ${lastPaymentDate}`;
  
          li.appendChild(lastPaymentLabel);
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Eliminar';
          deleteButton.addEventListener('click', function() {
            deleteMember(i);
          });
          li.appendChild(deleteButton);
          
          membersList.appendChild(li);
        }
      }
    }
  
    function addMember() {
      const memberName = newMemberNameInput.value.trim();
      if (memberName === '') return;
  
      memberCount++;
      localStorage.setItem('memberCount', memberCount);
      localStorage.setItem(`member${memberCount}`, memberName);
  
      updateMemberCounter();
      renderMembers();
  
      newMemberNameInput.value = '';
    }
  
    function deleteMember(memberIndex) {
      if (memberIndex < 1 || memberIndex > memberCount) return;
  
      for (let i = memberIndex; i < memberCount; i++) {
        localStorage.setItem(`member${i}`, localStorage.getItem(`member${i + 1}`));
        localStorage.setItem(`paymentStatus_${i}`, localStorage.getItem(`paymentStatus_${i + 1}`));
        localStorage.setItem(`lastPaymentDate_${i}`, localStorage.getItem(`lastPaymentDate_${i + 1}`));
      }
  
      localStorage.removeItem(`member${memberCount}`);
      localStorage.removeItem(`paymentStatus_${memberCount}`);
      localStorage.removeItem(`lastPaymentDate_${memberCount}`);
  
      memberCount--;
      localStorage.setItem('memberCount', memberCount);
  
      updateMemberCounter();
      renderMembers();
    }
  
    function getCurrentDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  
    addMemberBtn.addEventListener('click', addMember);
    searchInput.addEventListener('input', renderMembers);
  
    // Renderizar miembros existentes en la carga de la página
    updateMemberCounter();
    renderMembers();
  });
  
  