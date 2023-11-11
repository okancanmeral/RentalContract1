const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'https://mainnet.infura.io/v3/your-infura-project-id'); // MetaMask veya Infura RPC bağlantısı

const contractAddress = '0xYourContractAddress'; // Akıllı kontrat adresi
const contractABI = [...];

// MetaMask kullanıcı hesaplarınızı almak için aşağıdaki kodu kullanabilirsiniz
web3.eth.getAccounts()
  .then(accounts => {
    const userAddress = accounts[0]; // MetaMask'tan alınan kullanıcı hesapları

    // Akıllı kontrat nesnesini oluşturmak
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Kiracı olarak yeni bir sözleşme oluşturma işlemi
    contract.methods.createContract(tenantAddress, rentAmount, startDate, endDate)
      .send({ from: userAddress, gas: 3000000 })
      .on('receipt', receipt => {
        console.log('Sözleşme oluşturuldu:', receipt);
      });

    // Mülk sahibi olarak sözleşmeyi sonlandırma işlemi
    contract.methods.deactivateContract()
      .send({ from: userAddress, gas: 3000000 })
      .on('receipt', receipt => {
        console.log('Sözleşme sonlandırıldı:', receipt);
      });

    // Şikayet dosyası işlemi
    contract.methods.fileComplaint('Açıklama')
      .send({ from: userAddress, gas: 3000000 })
      .on('receipt', receipt => {
        console.log('Şikayet dosyası oluşturuldu:', receipt);
      });

    // Şikayet çözümü işlemi
    contract.methods.resolveComplaint(complaintIndex, 'Onaylandı')
      .send({ from: userAddress, gas: 3000000 })
      .on('receipt', receipt => {
        console.log('Şikayet çözüldü:', receipt);
      });

    // Erken sonlandırma talebi işlemi
    contract.methods.requestTermination()
      .send({ from: userAddress, gas: 3000000 })
      .on('receipt', receipt => {
        console.log('Erken sonlandırma talebi gönderildi:', receipt);
      });

    // Erken sonlandırmayı onaylama işlemi (mülk sahibi tarafından)
    contract.methods.approveTermination()
      .send({ from: userAddress, gas: 3000000 })
      .on('receipt', receipt => {
        console.log('Erken sonlandırma onaylandı:', receipt);
      });
  })
  .catch(err => {
    console.error('Hesap alınamadı:', err);
  });
