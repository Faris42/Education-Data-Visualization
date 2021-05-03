/**
 * The main runner function for the app and map selection screen.
 */
async function main() {
  // SWITCH OFF LANDING SCREEN
  d3.select('#screen_landing').style('display', 'none');
  d3.select('#screen_select').style('display', 'flex');

  // INITIALIZE VARIABLES
  let yearIndex = 0;
  let selected = null;
  let compSelected = [];
  let isSingle = true;
  let play = false;
  let interval;
  const animationDuration = 25;
  const hoverOpacity = 0.5;
  const selectScreenYear = 2015;

  // SETUP SVGS AND RESPONSIVE LAYOUTS
  const mainSvg = d3.select('#main');
  const { mainWidth, mainHeight } = getDims();

  mainSvg.style('width', mainWidth);
  mainSvg.style('height', mainHeight);
  const mainMap = mainSvg.append('g');

  // ASSIGNED VARIABLES TO HTML ELEMENTS
  const stateLabel = d3.select('#state_label');
  const mapLegend = d3.select('#map_legend');
  const playPauseButton = d3.select('#playPauseButton');
  const switchToSingle = d3.select('#switch_mode_single');
  const switchToComp = d3.select('#switch_mode_comp');
  const singleBack = d3.select('#single_back');
  const compBack = d3.select('#double_back');
  const modeSwitchLabel = d3.select('#action_item');
  const dateSlider = d3.select('#date_slider');

  // GET DATA
  const [us, data] = await Promise.all([
    d3.json('data/states-10m.json'),
    d3.csv('data/final.csv'),
  ]);

  // CREATE SCALES AND PROJECTION
  const stateDict = new StateDict(data);
  const domain = stateDict.getAllForField(2015, 'EXPENDITURE_PER_STUDENT');
  const years = stateDict.getYears();
  const colorScale = d3
    .scaleQuantile()
    .domain(domain)
    .range(['#202c49', '#274c6f', '#2979a3', '#16b6eb']);

  const projection = d3
    .geoAlbersUsa()
    .scale(mainWidth)
    .translate([mainWidth / 2, mainHeight / 2]);
  const path = d3.geoPath().projection(projection);

  const nation = topojson.feature(us, us.objects.nation);
  const states = topojson.feature(us, us.objects.states);
  const statesMesh = topojson.mesh(us, us.objects.states);

  mainMap
    .selectAll('path.nation')
    .data(nation.features)
    .join('path')
    .attr('class', 'nation')
    .attr('d', path);

  mainMap
    .append('path')
    .datum(statesMesh)
    .attr('class', 'outline')
    .attr('d', path);

  // Initialize slider range
  dateSlider.attr('max', years.length === 0 ? 0 : years.length - 1);

  /**
   * Returns the mainHeight and mainWidth for a responsive map layout. Prioritizes
   * width and uses a 2:1 aspect ratio, but also checks for overflow and adjusts
   * accordingly.
   * @returns {any}
   */
  function getDims() {
    let aspectRatio = 0.5;
    let mainWidth = parseInt(d3.select('#map_column').style('width'));
    let mainHeight = mainWidth * aspectRatio;
    const leftOver =
      window.innerHeight -
      parseInt(d3.select('#header').style('height')) -
      parseInt(d3.select('#legend_wrapper').style('height')) -
      parseInt(d3.select('#legend_wrapper').style('margin-top'));

    if (mainHeight > leftOver) {
      aspectRatio = 2;
      mainHeight = leftOver;
      mainWidth = mainHeight * aspectRatio;
    }
    return { mainHeight: mainHeight, mainWidth: mainWidth };
  }

  /**
   * Renders the map using a data join. Uses global variables `mainMap`, `states`,
   * and `path`.
   * @param {number} year
   * @param {boolean} isSingle
   */
  function renderStates(year, isSingle) {
    mainMap
      .selectAll('path.state')
      .data(states.features)
      .join('path')
      .attr('stateName', name)
      .attr('class', 'state')
      .attr('fill', (d) => score(d, year))
      .attr('d', path)
      .style('opacity', 1)
      .on('mouseover', onMouseOver(!isSingle))
      .on('mouseleave', onMouseLeave(!isSingle))
      .on('click', isSingle ? selectState : selectComp);
  }

  /**
   * Resets the app to go to the select screen. Pauses the date slider if it is
   * playing.
   */
  function reset() {
    if (play) {
      playOrPause(years);
    }
    selected = null;
    compSelected = [];
    d3.select('path.state').style('opacity', 1);
    d3.select('#screen_select').style('display', 'flex');
    d3.select('#screen_single').style('display', 'none');
    d3.select('#screen_double').style('display', 'none');
    d3.select('#slider_wrapper').style('display', 'none');
  }

  /**
   * On click handler for states in the single mode.
   * @param {any} e
   */
  function selectState(e) {
    selected = e.target.getAttribute('stateName');
    d3.select('#screen_select').style('display', 'none');
    d3.select('#slider_wrapper').style('display', 'flex');
    d3.select('#screen_single').style('display', 'flex');
    d3.select('#single_name').text(selected);
    const activeYear = years[yearIndex];
    renderSingle(stateDict, selected, years, activeYear);
  }

  /**
   * On click handler for states in the comparison mode.
   * @param {any} e
   */
  function selectComp(e) {
    // Impossible: 2+ elements in compSelected
    if (compSelected.length > 2) {
      console.warn('compSelected length > 2');
      return;
    }
    const ele = d3.select(this);
    selected = e.target.getAttribute('stateName');

    if (compSelected.length === 1) {
      // 1 element in compSelected
      if (selected === compSelected[0]) {
        // Deselect and return.
        compSelected = [];
        ele.style('opacity', hoverOpacity);
        return;
      }
      compSelected.push(selected);
      d3.select('#screen_select').style('display', 'none');
      d3.select('#slider_wrapper').style('display', 'flex');
      d3.select('#screen_double').style('display', 'flex');
      d3.select('#double_title').text(compSelected.join(' vs. '));
      const activeYear = years[yearIndex];
      renderDouble(stateDict, compSelected, years, activeYear);
    } else {
      compSelected.push(selected);
      ele.style('opacity', 1);
    }
    return;
  }

  /**
   * Returns the name associated with the state data.
   * @param {any} d
   * @returns {string}
   */
  function name(d) {
    const state = stateDict.states[d.properties.name];
    if (!state) return 'unspecified';
    return state.name;
  }

  /**
   * Returns the color representation associated with the state data and the
   * given year.
   * @param {any} d
   * @param {number} year
   * @returns {string}
   */
  function score(d, year) {
    const state = stateDict.states[d.properties.name];
    if (!state) return 'grey';
    const record = state.years[year.toString()];
    if (!record) {
      console.warn('NOT FOUND', d.properties.name, year);
      return 'grey';
    }
    return colorScale(record.EXPENDITURE_PER_STUDENT);
  }

  /**
   * Advances the date slider by one year from the current yearIndex and renders
   * the screen.
   * @param {Array<number>} all_years
   */
  function advanceYear(all_years) {
    yearIndex++;
    if (yearIndex === all_years.length) yearIndex = 0;
    const new_year = all_years[yearIndex];
    d3.select('#slider_title').text(new_year);
    dateSlider.attr('value', yearIndex);
    if (selected === null && compSelected.length === 0) {
      renderStates(2015, isSingle);
    } else if (isSingle) {
      renderSingle(stateDict, selected, all_years, new_year);
    } else {
      renderDouble(stateDict, compSelected, all_years, new_year);
    }
  }

  /**
   * Sets the current year to the year at newIndex in all_years.
   * @param {Array<number>} all_years
   * @param {number} newIndex
   */
  function setYear(all_years, newIndex) {
    yearIndex = newIndex;
    const new_year = all_years[yearIndex];
    d3.select('#slider_title').text(new_year);
    dateSlider.attr('value', yearIndex);
    if (selected === null && compSelected.length === 0) {
      renderStates(2015, isSingle);
    } else if (isSingle) {
      renderSingle(stateDict, selected, all_years, new_year);
    } else {
      renderDouble(stateDict, compSelected, all_years, new_year);
    }
  }

  /**
   * Plays the date loop if it is paused, otherwise pauses.
   * @param {Array<number>} all_years
   */
  function playOrPause(all_years) {
    if (play) {
      d3.select('#playPauseButton').text('Play');
      play = false;
      clearInterval(interval);
    } else {
      d3.select('#playPauseButton').text('Pause');
      play = true;
      interval = setInterval(() => advanceYear(all_years), 1500);
    }
  }

  /**
   * Switches the mode to single view. Clears all selections.
   */
  function singleView() {
    reset();
    isSingle = true;
    renderStates(2015, isSingle);
    switchToSingle.attr('class', 'mode_selector on');
    switchToComp.attr('class', 'mode_selector');
    modeSwitchLabel.text('See more details by clicking on a state.');
  }

  /**
   * Switches the mode to comparison view. Clears all selections.
   */
  function compView() {
    reset();
    isSingle = false;
    renderStates(2015, isSingle);
    switchToComp.attr('class', 'mode_selector on');
    switchToSingle.attr('class', 'mode_selector');
    modeSwitchLabel.text('Select two states to compare them.');
  }

  /**
   * Returns a mouseover event handler function that modifies the styling
   * of the states in the map. Has different behavior depending on if
   * the app is in comparison mode or not as specified by isComp.
   * @param {boolean} isComp
   */
  function onMouseOver(isComp) {
    return function (e) {
      // Select states that need to be changed
      const toChange = isComp
        ? d3.selectAll('path.state').filter((d, i) => {
            const name = d.properties.name;
            return !compSelected.includes(name);
          })
        : d3.selectAll('path.state');
      // Make states on hover opacity.
      toChange
        .transition()
        .duration(animationDuration)
        .style('opacity', hoverOpacity);
      d3.select(this)
        .transition()
        .duration(animationDuration)
        .style('opacity', 1);
      const stateName = e.target.getAttribute('stateName');
      const record = stateDict.getRecord(stateName, selectScreenYear);
      d3.select('#state_label_name').text(`${stateName}`);
      d3.select('#state_label_expenditures').text(
        `${floatToDollars(record.EXPENDITURE_PER_STUDENT * 1000)}`
      );
      d3.select('#state_label_gdp').text(`
                ${floatToDollars(record.GDP_PER_CAPITA * 1000000)}
            `);
      d3.select('#state_label_scores').text(`
               ${decimalToPercent(record.AVG_SCORE_PERCENTAGE)}
            `);
      stateLabel.style('visibility', 'visible');
    };
  }

  function onMouseLeave(isComp) {
    return function (e) {
      stateLabel.style('visibility', 'hidden');
      if (!isComp) {
        d3.selectAll('path.state')
          .transition()
          .duration(animationDuration)
          .style('opacity', 1);
      } else if (compSelected.length == 1) {
        d3.selectAll('path.state')
          .filter((d, i) => {
            const name = d.properties.name;
            return !compSelected.includes(name);
          })
          .transition()
          .duration(animationDuration)
          .style('opacity', hoverOpacity);
      } else {
        d3.selectAll('path.state')
          .transition()
          .duration(animationDuration)
          .style('opacity', 1);
      }
    };
  }

  function onChangeSlider(all_years) {
    return function (e) {
      if (play) {
        playOrPause(all_years);
      }
      setYear(all_years, e.target.value);
    };
  }

  playPauseButton.on('click', () => playOrPause(years));
  switchToSingle.on('click', () => singleView());
  switchToComp.on('click', () => compView());
  singleBack.on('click', reset);
  compBack.on('click', reset);
  dateSlider.on('input', onChangeSlider(years));

  renderStates(2015, isSingle);
  drawLegend(mapLegend, colorScale);

  return;
}
