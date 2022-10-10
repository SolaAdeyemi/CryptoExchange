import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5stock from "@amcharts/amcharts5/stock";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function StockChart(props) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let stockChart = root.container.children.push(
      am5stock.StockChart.new(root, {})
    );

    root.numberFormatter.set("numberFormat", "#,###.00");

    let mainPanel = stockChart.panels.push(
      am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true,
      })
    );

    let valueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom",
        }),
        extraMin: 0.1, // adds some space for for main series
        tooltip: am5.Tooltip.new(root, {}),
        numberFormat: "#,###.00",
        extraTooltipPrecision: 2,
      })
    );

    let dateAxis = mainPanel.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let valueSeries = mainPanel.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: "MSFT",
        clustered: false,
        valueXField: "Date",
        valueYField: "Close",
        highValueYField: "High",
        lowValueYField: "Low",
        openValueYField: "Open",
        calculateAggregates: true,
        xAxis: dateAxis,
        yAxis: valueAxis,
        legendValueText:
          "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
        legendRangeValueText: "",
      })
    );

    stockChart.set("stockSeries", valueSeries);

    let valueLegend = mainPanel.plotContainer.children.push(
      am5stock.StockLegend.new(root, {
        stockChart: stockChart,
      })
    );

    let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
      inside: true,
    });

    volumeAxisRenderer.labels.template.set("forceHidden", true);
    volumeAxisRenderer.grid.template.set("forceHidden", true);

    let volumeValueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        numberFormat: "#.#a",
        height: am5.percent(20),
        y: am5.percent(100),
        centerY: am5.percent(100),
        renderer: volumeAxisRenderer,
      })
    );

    let volumeSeries = mainPanel.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Volume",
        clustered: false,
        valueXField: "Date",
        valueYField: "Volume",
        xAxis: dateAxis,
        yAxis: volumeValueAxis,
        legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]",
      })
    );

    volumeSeries.columns.template.setAll({
      strokeOpacity: 0,
      fillOpacity: 0.5,
    });

    // color columns by stock rules
    volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
      let dataItem = target.dataItem;
      if (dataItem) {
        return stockChart.getVolumeColor(dataItem);
      }
      return fill;
    });

    stockChart.set("volumeSeries", volumeSeries);
    valueLegend.data.setAll([valueSeries, volumeSeries]);

    mainPanel.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        yAxis: valueAxis,
        xAxis: dateAxis,
        snapToSeries: [valueSeries],
        snapToSeriesBy: "y!",
      })
    );

    let scrollbar = mainPanel.set(
      "scrollbarX",
      am5xy.XYChartScrollbar.new(root, {
        orientation: "horizontal",
        height: 50,
      })
    );
    stockChart.toolsContainer.children.push(scrollbar);

    let sbDateAxis = scrollbar.chart.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    let sbValueAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let sbSeries = scrollbar.chart.series.push(
      am5xy.LineSeries.new(root, {
        valueYField: "Close",
        valueXField: "Date",
        xAxis: sbDateAxis,
        yAxis: sbValueAxis,
      })
    );

    sbSeries.fills.template.setAll({
      visible: true,
      fillOpacity: 0.3,
    });

    let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
      stockChart: stockChart,
    });

    seriesSwitcher.events.on("selected", function (ev) {
      setSeriesType(ev.item.id);
    });

    function getNewSettings(series) {
      let newSettings = [];
      am5.array.each(
        [
          "name",
          "valueYField",
          "highValueYField",
          "lowValueYField",
          "openValueYField",
          "calculateAggregates",
          "valueXField",
          "xAxis",
          "yAxis",
          "legendValueText",
          "stroke",
          "fill",
        ],
        function (setting) {
          newSettings[setting] = series.get(setting);
        }
      );
      return newSettings;
    }

    function setSeriesType(seriesType) {
      // Get current series and its settings
      let currentSeries = stockChart.get("stockSeries");
      let newSettings = getNewSettings(currentSeries);

      // Remove previous series
      let data = currentSeries.data.values;
      mainPanel.series.removeValue(currentSeries);

      // Create new series
      let series;
      switch (seriesType) {
        case "line":
          series = mainPanel.series.push(
            am5xy.LineSeries.new(root, newSettings)
          );
          break;
        case "candlestick":
        case "procandlestick":
          newSettings.clustered = false;
          series = mainPanel.series.push(
            am5xy.CandlestickSeries.new(root, newSettings)
          );
          if (seriesType === "procandlestick") {
            series.columns.template.get("themeTags").push("pro");
          }
          break;
        case "ohlc":
          newSettings.clustered = false;
          series = mainPanel.series.push(
            am5xy.OHLCSeries.new(root, newSettings)
          );
          break;
        default:
          break;
      }

      // Set new series as stockSeries
      if (series) {
        valueLegend.data.removeValue(currentSeries);
        series.data.setAll(data);
        stockChart.set("stockSeries", series);
        let cursor = mainPanel.get("cursor");
        if (cursor) {
          cursor.set("snapToSeries", [series]);
        }
        valueLegend.data.insertIndex(0, series);
      }
    }

    am5stock.StockToolbar.new(root, {
      container: document.getElementById("chartcontrols"),
      stockChart: stockChart,
      controls: [
        am5stock.IndicatorControl.new(root, {
          stockChart: stockChart,
          legend: valueLegend,
        }),
        am5stock.DateRangeSelector.new(root, {
          stockChart: stockChart,
        }),
        am5stock.PeriodSelector.new(root, {
          stockChart: stockChart,
        }),
        seriesSwitcher,
        am5stock.DrawingControl.new(root, {
          stockChart: stockChart,
        }),
        am5stock.ResetControl.new(root, {
          stockChart: stockChart,
        }),
        am5stock.SettingsControl.new(root, {
          stockChart: stockChart,
        }),
      ],
    });

    let rawData = props.data;

    function parseData(data) {
      let proccesedData = [];
      for (let i = 0; i < data.length; i++) {
        const newFormat = {
          Date: parseFloat(data[i].timestamp),
          Open: parseFloat(data[i].open),
          High: parseFloat(data[i].high),
          Low: parseFloat(data[i].low),
          Close: parseFloat(data[i].close),
          Volume: parseFloat(data[i].volume),
        };
        proccesedData.push(newFormat);
      }

      return proccesedData;
    }

    let data = parseData(rawData);
    console.log(data[0].Date);
    console.log(data[1].Date);
    console.log(data[2].Date);

    let tooltip = am5.Tooltip.new(root, {
      getStrokeFromSprite: false,
      getFillFromSprite: false,
    });

    tooltip.get("background").setAll({
      strokeOpacity: 1,
      stroke: am5.color(0x000000),
    });

    function makeEvent(date, letter, color, description) {
      let dataItem = dateAxis.createAxisRange(
        dateAxis.makeDataItem({ value: date })
      );
      let grid = dataItem.get("grid");
      if (grid) {
        grid.setAll({
          visible: true,
          strokeOpacity: 0.2,
          strokeDasharray: [3, 3],
        });
      }

      let bullet = am5.Container.new(root, {
        y: -100,
      });

      bullet.children.push(
        am5.Circle.new(root, {
          radius: 10,
          stroke: color,
          fill: am5.color(0xffffff),
          tooltipText: description,
          tooltip: tooltip,
          tooltipY: 0,
        })
      );

      bullet.children.push(
        am5.Label.new(root, {
          text: letter,
          centerX: am5.p50,
          centerY: am5.p50,
        })
      );

      dataItem.set(
        "bullet",
        am5xy.AxisBullet.new(root, {
          location: 0,
          sprite: bullet,
        })
      );
    }

    makeEvent(1619006400000, "S", am5.color(0xff0000), "Split 4:1");
    makeEvent(1634212800000, "D", am5.color(0x00ff00), "Dividends paid");

    // set data to all series
    valueSeries.data.setAll(data);
    volumeSeries.data.setAll(data);
    sbSeries.data.setAll(data);
    return () => {
      root.dispose();
    };
  }, []);
  return (
    <div style={{ padding: "50px 80px" }}>
      <div id="chartcontrols" />
      <div
        id="chartdiv"
        style={{ minHeight: 600, height: "calc(100vh - 160px)" }}
      />
    </div>
  );
}
