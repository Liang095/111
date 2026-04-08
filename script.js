document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('surveyForm');
    const messageDiv = document.getElementById('message');

    // ✅ 你的 JSONBin 信息（已经帮你放好了）
    const jsonbinAccessKey = '$2a$10$ZF6.ipuaKIsSjeq2V6Yd2O7h/csMCnFKZ4wGgFYb0mO5XKxX7okN2';
    const binId = '69d503f0856a68218909f7f5';
    const jsonbinBaseUrl = `https://api.jsonbin.io/v3/b/${binId}`;

    // ✅ 获取已有数据
    async function fetchExistingData() {
        try {
            const response = await fetch(jsonbinBaseUrl + '/latest', {
                headers: {
                    'X-Master-Key': jsonbinAccessKey,
                },
            });

            if (response.ok) {
                const result = await response.json();
                return result.record || [];
            } else {
                console.warn('获取数据失败，使用空数组');
                return [];
            }
        } catch (error) {
            console.error('获取数据错误:', error);
            return [];
        }
    }

    // ✅ 写入数据（不再重复 push）
    async function updateBin(data) {
        try {
            const response = await fetch(jsonbinBaseUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': jsonbinAccessKey,
                },
                body: JSON.stringify(data),
            });

            return response.ok;
        } catch (error) {
            console.error('提交错误:', error);
            return false;
        }
    }

    // ✅ 表单提交
    surveyForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // ⭐ 阻止刷新

        messageDiv.textContent = '正在提交...';
        messageDiv.className = '';

        const formData = new FormData(surveyForm);
        const answers = {};
let allAnswered = true;

for (let i = 1; i <= 10; i++) {
    const val = formData.get(`q${i}`);
    if (!val) {
        allAnswered = false;
    }
}

// 如果没做完，直接拦截
if (!allAnswered) {
    messageDiv.textContent = '请完成所有必答题！';
    messageDiv.className = 'error';
    return; // ❗阻止提交
}

        // 1~10题
        for (let i = 1; i <= 10; i++) {
            const val = formData.get(`q${i}`);
            answers[`问题${i}`] = val || '未选择';
        }

        // 第11题
        answers['问题11'] = formData.get('q11') || '无';

        const newEntry = {
            time: new Date().toISOString(),
            answers: answers
        };

        // 👉 关键流程
        const existingData = await fetchExistingData();
        existingData.push(newEntry);
        const success = await updateBin(existingData);

        if (success) {
            alert("提交成功！");
            messageDiv.textContent = '提交成功！';
            messageDiv.className = 'success';
            surveyForm.reset();
        } else {
            messageDiv.textContent = '提交失败，请重试';
            messageDiv.className = 'error';
        }
    });
});