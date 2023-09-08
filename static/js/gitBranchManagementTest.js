// Get the graph container HTML element.
const graphContainer = document.getElementById("gitGraph");

// Instantiate the graph.
const gitgraph = GitgraphJS.createGitgraph(graphContainer, {
        mode: GitgraphJS.Mode.Compact
      });

const count = 9; // Общее кол-во веток
const branches = [];  // Хранилище всех веток
const links = [ //Список пересечений
    { from: 3, to: 5 },
    { from: 2, to: 5 },
    { from: 5, to: 4 },
    { from: 4, to: 2 },
    { from: 3, to: 1 }
];

// Создание веток
for (let i = 0; i < count; i++) {
    const customStyle = {
        name: i.toString(),
        // fastForward: true,
        from:  i == 0 ? gitgraph : branches[i-1],
        style: {
            color: "#fd0052",
            bgColor: '#ce9b00',
        }
    }

    const newBranch = gitgraph.branch(customStyle);

    newBranch.commit();
    branches.push(newBranch);
}

// Пересечения веток
for (let i = 0; i < links.length; i++) {
    const from = branches[links[i].from-1];
    const to = branches[links[i].to-1];

    from.commit();
    to.merge(from);
}


// Слияние веток
for (let i = count-1; i > 0; i--) {
    branches[i-1].merge(branches[i]);
}

//
// develop.merge(aFeature);
// master.merge(develop);